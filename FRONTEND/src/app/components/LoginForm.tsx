import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, User, Lock, Eye } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, setStoredAuth, loginWithGoogle } from '@/app/api/auth';
import { validateEmail, validatePassword } from '@/app/lib/validation';
import { CyberLoadingAnimation } from '@/app/components/CyberLoadingAnimation';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCyberAnimation, setShowCyberAnimation] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const data = await loginWithGoogle();
      setStoredAuth(data);
      setIsLoading(false);
      console.log('✅ Google login successful, showing animation');
      setShowCyberAnimation(true);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setIsLoading(false);
        return;
      }
      setError(err instanceof Error ? err.message : 'Google login failed');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const uErr = validateEmail(email);
    const pErr = validatePassword(password);
    setFieldErrors({ email: uErr || undefined, password: pErr || undefined });
    if (uErr || pErr) return;
    setIsLoading(true);
    try {
      const data = await loginApi(email.trim(), password);
      setStoredAuth(data);
      if (rememberDevice) localStorage.setItem('rememberedDevice', 'true');
      else localStorage.removeItem('rememberedDevice');
      setIsLoading(false);
      console.log('✅ Email login successful, showing animation');
      setShowCyberAnimation(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsLoading(false);
    }
  };

  const handleAnimationComplete = () => {
    navigate('/');
  };

  if (showCyberAnimation) {
    return <CyberLoadingAnimation onComplete={handleAnimationComplete} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#0a0e27]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-xl border text-card-foreground bg-card/50 backdrop-blur-xl border-primary/20 shadow-2xl shadow-black/40 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-75"></div>

          <div className="flex flex-col space-y-1.5 p-6 text-center pb-2 pt-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20 shadow-[0_0_15px_rgba(100,255,218,0.15)]">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">System Access</div>
            <div className="text-sm text-slate-400">Enter credentials to authenticate</div>
          </div>

          <div className="p-6 space-y-6 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs font-medium uppercase tracking-wider text-primary/80 ml-1" htmlFor="email">
                  Email
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFieldErrors((prev) => ({ ...prev, email: undefined })); }}
                    required
                    className={`flex w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 bg-black/20 border-white/10 focus:border-primary/50 transition-all duration-300 input-glow h-11 ${fieldErrors.email ? 'border-red-500/50' : ''}`}
                  />
                  {fieldErrors.email && <p className="text-xs text-red-400 mt-1 ml-1">{fieldErrors.email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs font-medium uppercase tracking-wider text-primary/80 ml-1" htmlFor="password">
                    Passcode
                  </label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setFieldErrors((prev) => ({ ...prev, password: undefined })); }}
                    required
                    className={`flex w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 pr-10 bg-black/20 border-white/10 focus:border-primary/50 transition-all duration-300 input-glow h-11 ${fieldErrors.password ? 'border-red-500/50' : ''}`}
                  />
                  {fieldErrors.password && <p className="text-xs text-red-400 mt-1 ml-1">{fieldErrors.password}</p>}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-white transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
                  {error}
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberDevice}
                    onCheckedChange={(checked) => setRememberDevice(checked === true)}
                    className="h-4 w-4 shrink-0 rounded-sm border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-primary-foreground border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label htmlFor="remember" className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-400 cursor-pointer">
                    Remember device
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/recovery')}
                  className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                >
                  Recovery options?
                </button>
              </div>

              <button
                type="submit"
                disabled={!email.trim() || !password || isLoading}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-primary-border min-h-9 px-4 py-2 w-full h-12 bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-[0_0_20px_rgba(100,255,218,0.2)] mt-6 text-base"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Secure Login
                    <ShieldCheck className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0a0e27] px-2 text-slate-500">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 py-2 text-sm font-medium text-white shadow-sm hover:bg-white/10 transition-colors h-11 hover:scale-[1.01] active:scale-[0.99] duration-200"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
            </form>
          </div>

          <div className="p-6 pb-6 pt-2 flex flex-col items-center gap-4 text-center">
            <div className="text-xs text-slate-500 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
              <Lock className="w-3 h-3 text-primary" />
              <span>End-to-end encrypted connection</span>
            </div>
            <p className="text-xs text-slate-500">
              Don't have credentials?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-primary hover:underline font-medium"
              >
                Request access
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
