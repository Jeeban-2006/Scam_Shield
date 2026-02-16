import { apiUrl } from './config';
import { getStoredAuth } from './auth';
import { auth as firebaseAuth } from '../firebase';

export interface LinkCheckResult {
  is_valid: boolean;
  is_safe: boolean;
  domain: string | null;
  ssl_valid: boolean;
  risk_level: string;
  risk_score: number;
  red_flags: string[];
  analysis: string;
  ml_prediction?: string;
  ml_confidence?: number;
  ml_patterns?: string[];
}

export async function checkLink(url: string): Promise<LinkCheckResult> {
  const stored = getStoredAuth();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  // Get fresh Firebase ID token if user is logged in
  if (stored?.user && firebaseAuth.currentUser) {
    try {
      const token = await firebaseAuth.currentUser.getIdToken();
      headers['Authorization'] = `Token ${token}`;
    } catch (e) {
      console.warn('Failed to get Firebase token:', e);
    }
  }

  let res: Response;
  try {
    res = await fetch(apiUrl('/link/check/'), {
      method: 'POST',
      headers,
      body: JSON.stringify({ url: url.trim() }),
    });
  } catch (e) {
    throw new Error('Cannot reach server. Ensure the backend is running (e.g. py manage.py runserver).');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Link check failed');
  return data;
}
