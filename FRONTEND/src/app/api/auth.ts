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
  signInWithPopup
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

export async function register(username: string, email: string, password: string): Promise<AuthResponse> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: username });

  const token = await userCredential.user.getIdToken();
  const user = formatUser(userCredential.user);

  return { token, user };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  const user = formatUser(userCredential.user);

  return { token, user };
}

export async function me(token: string): Promise<{ user: AuthUser }> {
  // Verify current user state
  const user = auth.currentUser;
  if (!user) throw new Error('Session invalid');
  return { user: formatUser(user) };
}

export async function recoveryRequest(email: string): Promise<{ message: string }> {
  await sendPasswordResetEmail(auth, email);
  return { message: 'Password reset email sent' };
}

export async function recoveryVerify(email: string, code: string, newPassword: string): Promise<{ message: string }> {
  // Firebase handles reset via the email link, which opens a page served by Firebase or our app.
  // Standard Firebase flow doesn't use a manual code entry API like this.
  // We'll throw an error or implement a workaround if possible, but typically 
  // you use confirmPasswordReset(auth, code, newPassword).
  // The 'code' here would come from the URL query param 'oobCode'.

  // Assuming the user is trying to reset password with a code they received:
  // Note: The UI might need to capture the oobCode from the URL.
  // If the previous flow was "enter code from email", that's different from Firebase's "click link".

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
    throw err;
  }

  await updateFirebasePassword(user, newPassword);
  return { message: 'Password updated successfully' };
}

