import { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from '@/app/components/Navigation';
import { Home } from '@/app/components/Home';
import { MessageAnalyzer } from '@/app/components/MessageAnalyzer';
import { MessageResult } from '@/app/components/MessageResult';
import { LinkChecker } from '@/app/components/LinkChecker';
import { LinkResult } from '@/app/components/LinkResult';
import { ReportScam } from '@/app/components/ReportScam';
import { Profile } from '@/app/components/Profile';
import { AwarenessQuiz } from '@/app/components/AwarenessQuiz';
import { LoginForm } from '@/app/components/LoginForm';
import { SignUpForm } from '@/app/components/SignUpForm';
import { RecoveryForm } from '@/app/components/RecoveryForm';
import { Terms } from '@/app/components/Terms';
import { Privacy } from '@/app/components/Privacy';
import { About } from '@/app/components/About';
import { Intro } from '@/app/components/Intro';
import { Footer } from '@/app/components/Footer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/firebase';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center text-white">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const checkedRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      // Only check the authentication state once on mount.
      // This prevents the "Already Authenticated" screen from flashing
      // and interrupting the login animation when a user successfully logs in.
      if (!checkedRef.current) {
        checkedRef.current = true;
        setLoading(false);
        if (u) {
          setUser(u);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center text-white">Loading...</div>;

  if (user) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center px-4">
        <div className="bg-card/50 backdrop-blur-xl border border-primary/20 p-8 rounded-xl max-w-md w-full text-center shadow-2xl">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Already Authenticated</h1>
          <p className="text-slate-400 mb-8">
            You are currently signed in as <span className="text-primary">{user.email}</span>. You don't need to sign in again.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => { auth.signOut(); navigate('/login'); }}
              className="w-full py-3 border border-slate-700/50 hover:bg-white/5 rounded-lg text-slate-300 transition-colors"
            >
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/recovery'].includes(location.pathname);
  const isIntroPage = location.pathname === '/intro';
  return (
    <>
      <ScrollToTop />
      {!isIntroPage && <Navigation />}
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<RedirectIfAuthenticated><LoginForm /></RedirectIfAuthenticated>} />
          <Route path="/signup" element={<RedirectIfAuthenticated><SignUpForm /></RedirectIfAuthenticated>} />
          <Route path="/recovery" element={<RedirectIfAuthenticated><RecoveryForm /></RedirectIfAuthenticated>} />
          <Route path="/intro" element={<RequireAuth><Intro /></RequireAuth>} />
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/message-analyzer" element={<RequireAuth><MessageAnalyzer /></RequireAuth>} />
          <Route path="/message-result" element={<RequireAuth><MessageResult /></RequireAuth>} />
          <Route path="/link-checker" element={<RequireAuth><LinkChecker /></RequireAuth>} />
          <Route path="/link-result" element={<RequireAuth><LinkResult /></RequireAuth>} />
          <Route path="/report" element={<RequireAuth><ReportScam /></RequireAuth>} />
          <Route path="/quiz" element={<RequireAuth><AwarenessQuiz /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/about" element={<RequireAuth><About /></RequireAuth>} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>
      {!isAuthPage && !isIntroPage && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0e27] flex flex-col">
        <AppContent />
      </div>
    </Router>
  );
}
