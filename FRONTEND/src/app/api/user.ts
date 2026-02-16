import { apiUrl } from './config';
import { getStoredAuth } from './auth';
import { auth as firebaseAuth } from '../firebase';

async function authFetch(path: string, options: RequestInit = {}) {
  const stored = getStoredAuth();
  if (!stored?.user) throw new Error('Login required');

  // Get fresh Firebase ID token
  let token = stored.token;
  if (firebaseAuth.currentUser) {
    try {
      token = await firebaseAuth.currentUser.getIdToken();
    } catch (e) {
      console.warn('Failed to get fresh token, using stored:', e);
    }
  }

  const headers: Record<string, string> = { ...options.headers as Record<string, string> };
  headers['Authorization'] = `Token ${token}`;
  return fetch(apiUrl(path), { ...options, headers });
}

export interface UserProfile {
  user_id: number;
  email: string;
  name: string;
  created_at: string | null;
}

export interface UserStats {
  total_scans: number;
  scams_detected: number;
  safe_detected: number;
  quiz_score: number;
  join_date: string | null;
}

export interface ScanItem {
  id: number;
  content: string;
  risk_level: string;
  risk_score: number;
  created_at: string;
}

export interface ReportItem {
  report_id: string;
  content: string;
  scam_type: string;
  platform: string;
  status: string;
  created_at: string;
}

export async function getProfile(): Promise<UserProfile> {
  const res = await authFetch('/user/profile/');
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load profile');
  return data;
}

export async function updateProfile(payload: { name?: string; email?: string }): Promise<UserProfile> {
  const body: { name?: string; email?: string } = {};
  if (payload.email !== undefined) body.email = payload.email;
  if (payload.name !== undefined) body.name = payload.name;
  const res = await authFetch('/user/profile/', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Update failed');
  return data;
}

import { auth } from '../firebase';
import { GoogleAuthProvider, reauthenticateWithPopup } from 'firebase/auth';

export async function deleteAccount(): Promise<void> {
  // Try to delete from backend first (best effort)
  try {
    const res = await authFetch('/user/profile/', { method: 'DELETE' });
    if (!res.ok) {
      // We log but don't throw, so we can proceed to delete the Firebase user
      console.warn('Backend account deletion failed, proceeding with Firebase deletion.');
    }
  } catch (error) {
    console.warn('Backend account deletion error:', error);
  }

  // Delete from Firebase
  const user = auth.currentUser;
  if (user) {
    try {
      await user.delete();
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        // Implement auto-reauthentication for Google users
        const isGoogle = user.providerData.some(p => p.providerId === 'google.com');

        if (isGoogle) {
          try {
            const provider = new GoogleAuthProvider();
            await reauthenticateWithPopup(user, provider);
            // Retry deletion after successful re-auth
            await user.delete();
            return; // Success
          } catch (reAuthError) {
            console.error('Re-authentication failed:', reAuthError);
            throw new Error('Verification failed. Account not deleted.');
          }
        }

        throw new Error('For security, please log out and log back in before deleting your account.');
      }
      throw error;
    }
  }
}

export async function getStats(): Promise<UserStats> {
  const res = await authFetch('/user/stats/');
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load stats');
  return data;
}

export async function getMessageHistory(page = 1, limit = 10): Promise<{ scans: ScanItem[]; total: number; page: number; limit: number }> {
  const res = await authFetch(`/message/history/?page=${page}&limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load history');
  return data;
}

export async function getLinkHistory(page = 1, limit = 10): Promise<{ scans: ScanItem[]; total: number; page: number; limit: number }> {
  const res = await authFetch(`/link/history/?page=${page}&limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load history');
  return data;
}

export async function getMyReports(page = 1, limit = 10): Promise<{ reports: ReportItem[]; total: number; page: number; limit: number }> {
  const res = await authFetch(`/report/my-reports/?page=${page}&limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load reports');
  return data;
}
