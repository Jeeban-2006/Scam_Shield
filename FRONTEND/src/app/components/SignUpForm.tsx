import { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, User, Lock, Mail, Eye, EyeOff, Check } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { register as registerApi, setStoredAuth, loginWithGoogle } from '@/app/api/auth';
import { validateUsername, validateEmail, validatePasswordSignUp } from '@/app/lib/validation';
import { CyberLoadingAnimation } from '@/app/components/CyberLoadingAnimation';

export function SignUpForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [secureEnclave, setSecureEnclave] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showCyberAnimation, setShowCyberAnimation] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    return Math.min(strength, 4);
  };

  const passwordStrength = calculatePasswordStrength(password);
  const strengthColors = ['bg-red-500', 'bg-yellow-500', 'bg-yellow-400', 'bg-green-500', 'bg-[#00ff41]'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const data = await loginWithGoogle();
      setStoredAuth(data);
      setIsLoading(false);
      console.log('✅ Google signup successful, showing animation');
      setShowCyberAnimation(true);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setIsLoading(false);
        return;
      }
      setError(err instanceof Error ? err.message : 'Google sign-up failed');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const uErr = validateUsername(username);
    const eErr = validateEmail(email);
    const pErr = validatePasswordSignUp(password);
    const cErr = confirmPassword !== password ? 'Passwords do not match' : null;
    setFieldErrors({
      username: uErr || '',
      email: eErr || '',
      password: pErr || '',
      confirmPassword: cErr || '',
    });
    if (uErr || eErr || pErr || cErr) return;
    setIsLoading(true);
    try {
      // register takes (username, email, password)
      const data = await registerApi(username.trim(), email.trim(), password);
      setStoredAuth(data);
      setIsLoading(false);
      console.log('✅ Email signup successful, showing animation');
      setShowCyberAnimation(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      setIsLoading(false);
    }
  };

  const handleAnimationComplete = () => {
    navigate('/');
  };

  if (showCyberAnimation) {
    return <CyberLoadingAnimation onComplete={handleAnimationComplete} />;
  };

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
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">Create Identity</div>
            <div className="text-sm text-slate-400">Establish new secure credentials</div>
          </div>

          <div className="p-6 space-y-6 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-[#00d9ff] text-sm font-medium mb-2 uppercase tracking-wider">New Identity</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Username (3–30 chars)"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setFieldErrors((p) => ({ ...p, username: '' })); }}
                    required
                    className={`pl-10 h-12 bg-[#0a0e27] border-[#00d9ff]/30 text-white placeholder:text-gray-500 focus:border-[#00d9ff] ${fieldErrors.username ? 'border-red-500/50' : ''}`}
                  />
                </div>
                {fieldErrors.username && <p className="text-xs text-red-400 mt-1">{fieldErrors.username}</p>}
              </div>

              <div>
                <label className="block text-[#00d9ff] text-sm font-medium mb-2 uppercase tracking-wider">Email (required)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: '' })); }}
                    onBlur={() => { if (email.trim()) { const err = validateEmail(email); setFieldErrors((p) => ({ ...p, email: err || '' })); } }}
                    className={`pl-10 h-12 bg-[#0a0e27] border-[#00d9ff]/30 text-white placeholder:text-gray-500 focus:border-[#00d9ff] ${fieldErrors.email ? 'border-red-500/50' : ''}`}
                  />
                </div>
                {fieldErrors.email && <p className="text-xs text-red-400 mt-1">{fieldErrors.email}</p>}
              </div>

              <div>
                <label className="block text-[#00d9ff] text-sm font-medium mb-2 uppercase tracking-wider">New Passcode</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password (min 8 characters)"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: '', confirmPassword: '' })); }}
                    required
                    className={`pl-10 pr-10 h-12 bg-[#0a0e27] border-[#00d9ff]/30 text-white placeholder:text-gray-500 focus:border-[#00d9ff] ${fieldErrors.password ? 'border-red-500/50' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00d9ff] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`h-1 flex-1 rounded ${bar <= passwordStrength
                          ? strengthColors[passwordStrength] || 'bg-gray-700'
                          : 'bg-gray-700'
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password Strength: {password ? strengthLabels[passwordStrength] || 'Very Weak' : 'Not set'}
                  </p>
                </div>
                {fieldErrors.password && <p className="text-xs text-red-400 mt-1">{fieldErrors.password}</p>}
              </div>

              <div>
                <label className="block text-[#00d9ff] text-sm font-medium mb-2 uppercase tracking-wider">Confirm Passcode</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors((p) => ({ ...p, confirmPassword: '' })); }}
                    required
                    className={`pl-10 h-12 bg-[#0a0e27] border-[#00d9ff]/30 text-white placeholder:text-gray-500 focus:border-[#00d9ff] ${fieldErrors.confirmPassword ? 'border-red-500/50' : ''}`}
                  />
                </div>
                {fieldErrors.confirmPassword && <p className="text-xs text-red-400 mt-1">{fieldErrors.confirmPassword}</p>}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="twoFactor"
                    checked={twoFactor}
                    onCheckedChange={(checked) => setTwoFactor(checked === true)}
                  />
                  <label htmlFor="twoFactor" className="text-sm text-gray-300 cursor-pointer">
                    Two-factor authentication enabled by default
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="secureEnclave"
                    checked={secureEnclave}
                    onCheckedChange={(checked) => setSecureEnclave(checked === true)}
                  />
                  <label htmlFor="secureEnclave" className="text-sm text-gray-300 cursor-pointer">
                    Secure enclave storage
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={!username.trim() || !password || confirmPassword !== password || isLoading}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-primary-border min-h-9 px-4 py-2 w-full h-12 bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-[0_0_20px_rgba(100,255,218,0.2)] mt-6 text-base"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Initialize Identity
                    <Check className="w-4 h-4" />
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
                onClick={handleGoogleSignUp}
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
            <p className="text-xs text-slate-500">
              Already authenticated?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-primary hover:underline font-medium"
              >
                Access system
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
