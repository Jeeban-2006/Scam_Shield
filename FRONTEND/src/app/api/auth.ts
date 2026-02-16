import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword as updateFirebasePassword,
  User,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail
} from 'firebase/auth';



export async function loginWithGoogle(): Promise<AuthResponse> {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const token = await userCredential.user.getIdToken();
  const user = formatUser(userCredential.user);

  return { token, user };
}

export interface AuthUser {
  id: string; // Changed from number to string to accommodate Firebase UID
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

const AUTH_KEY = 'userCredentials';

// Helper to format Firebase user to our AuthUser
function formatUser(user: User): AuthUser {
  return {
    id: user.uid,
    username: user.displayName || user.email?.split('@')[0] || 'User',
    email: user.email || '',
  };
}

export function getStoredAuth(): { token: string; user: AuthUser } | null {
  // With Firebase, we rely on the SDK's persistence. 
  // However, for compatibility with existing synchronous checks, we can check auth.currentUser
  const user = auth.currentUser;
  if (!user) {
    // Fallback to local storage if we set it there manually, or return null
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data?.token && data?.user) return data;
      return null;
    } catch {
      return null;
    }
  }

  // Note: Token refresh is handled by SDK, getting a fresh one here is async.
  // We return the cached user state.
  return {
    token: 'firebase-active', // Token is managed by SDK
    user: formatUser(user)
  };
}

export function setStoredAuth(data: AuthResponse): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem('rememberedDevice');
  auth.signOut();
}

// Helper to map Firebase errors to user-friendly messages
function mapAuthError(error: any): Error {
  const code = error.code;
  if (code === 'auth/user-not-found') return new Error('User not registered. Please sign up first.');
  if (code === 'auth/wrong-password') return new Error('Invalid password.');
  if (code === 'auth/invalid-credential') return new Error('Invalid email or password. If you haven\'t registered, please sign up.');
  if (code === 'auth/email-already-in-use') return new Error('Email already registered.');
  if (code === 'auth/weak-password') return new Error('Password is too weak.');
  if (code === 'auth/invalid-email') return new Error('Invalid email address.');
  if (code === 'auth/network-request-failed') return new Error('Network error. Please check your connection.');
  return new Error(error.message || 'Authentication failed');
}

export async function register(username: string, email: string, password: string): Promise<AuthResponse> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: username });

    const token = await userCredential.user.getIdToken();
    const user = formatUser(userCredential.user);

    return { token, user };
  } catch (error) {
    throw mapAuthError(error);
  }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    const user = formatUser(userCredential.user);

    return { token, user };
  } catch (error: any) {
    // Attempt enhanced error detection
    if (error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/invalid-credential') {
      try {
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.length === 0) {
          // If the email is a Gmail address, it's highly likely they used Google Sign-In
          if (email.toLowerCase().endsWith('@gmail.com')) {
            throw new Error('This looks like a Gmail address. Did you sign up with Google? Please try the Google button.');
          }
          throw new Error('User not registered. Please sign up first.');
        }

        // Check for Google Sign-In exclusive accounts
        if (methods.includes('google.com') && !methods.includes('password')) {
          throw new Error('This email uses Google Sign-In. Please use the Google button.');
        }

        // If password method exists but login failed, it's definitely a wrong password
        if (methods.includes('password')) {
          throw new Error('Invalid password.');
        }

      } catch (innerError: any) {
        // If we threw a specific error above, rethrow it
        if (innerError.message.includes('User not registered') ||
          innerError.message.includes('Invalid password') ||
          innerError.message.includes('Google') ||
          innerError.message.includes('Gmail')) {
          throw innerError;
        }
        // If fetchSignInMethodsForEmail fails (e.g. security rules), fall through to default mapper
        console.warn('Smart error detection failed:', innerError);
      }
    }

    throw mapAuthError(error);
  }
}

export async function me(token: string): Promise<{ user: AuthUser }> {
  // Verify current user state
  const user = auth.currentUser;
  if (!user) throw new Error('Session invalid');
  return { user: formatUser(user) };
}

export async function recoveryRequest(email: string): Promise<{ message: string }> {
  try {
    await sendPasswordResetEmail(auth, email);
    return { message: 'Password reset email sent' };
  } catch (error) {
    throw mapAuthError(error);
  }
}

export async function recoveryVerify(email: string, code: string, newPassword: string): Promise<{ message: string }> {
  // Firebase handles reset via the email link, which opens a page served by Firebase or our app.
  throw new Error('Please check your email and click the password reset link.');
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('Login required');

  const credential = EmailAuthProvider.credential(user.email, oldPassword);

  try {
    await reauthenticateWithCredential(user, credential);
  } catch (err: any) {
    if (err.code === 'auth/wrong-password') throw new Error('Incorrect current password');
    throw mapAuthError(err);
  }

  try {
    await updateFirebasePassword(user, newPassword);
    return { message: 'Password updated successfully' };
  } catch (error) {
    throw mapAuthError(error);
  }
}

