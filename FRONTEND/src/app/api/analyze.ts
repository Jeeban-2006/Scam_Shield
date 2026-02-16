import { apiUrl } from './config';
import { getStoredAuth } from './auth';
import { auth as firebaseAuth } from '../firebase';

export interface AnalyzeResult {
  input_message: string;
  risk_level: string;
  scam_score: number;
  red_flags?: string[];
  confidence?: number;
  explanation?: string;
  tips?: string[];
  detected_keywords: string[];
  scam_type: string;
  explanation_for_user: string;
  detailed_reasons: string[];
  safety_tips: string[];
  detected_categories?: string[];
  language_detected?: string;
  odia_reasons?: string[];
  hindi_reasons?: string[];
  english_reasons?: string[];
}

export async function analyzeMessage(message: string): Promise<AnalyzeResult> {
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
    res = await fetch(apiUrl('/analyze/'), {
      method: 'POST',
      headers,
      body: JSON.stringify({ message: message.trim() }),
    });
  } catch (e) {
    throw new Error('Cannot reach server. Ensure the backend is running (e.g. py manage.py runserver).');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Analysis failed');
  return data;
}
