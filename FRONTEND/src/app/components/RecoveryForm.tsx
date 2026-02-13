import { useState } from 'react';
import { motion } from 'motion/react';
import { KeyRound, Mail, ArrowLeft, Shield } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { recoveryRequest } from '@/app/api/auth';
import { validateEmail } from '@/app/lib/validation';

export function RecoveryForm() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'success'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) return;
    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }
    setIsLoading(true);
    try {
      await recoveryRequest(email);
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-[#0a0e27]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10 mx-auto"
      >
        <div className="rounded-xl border text-card-foreground bg-card/50 backdrop-blur-xl border-primary/20 shadow-2xl shadow-black/40 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-75"></div>

          <div className="flex flex-col space-y-1.5 p-6 text-center pb-2 pt-8 relative">
            <button
              onClick={() => navigate('/login')}
              className="absolute left-6 top-6 flex items-center gap-2 text-slate-400 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to login</span>
            </button>

            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20 shadow-[0_0_15px_rgba(100,255,218,0.15)]">
              {step === 'success' ? (
                <Mail className="w-8 h-8 text-primary" />
              ) : (
                <KeyRound className="w-8 h-8 text-primary" />
              )}
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">
              {step === 'success' ? 'Check your inbox' : 'Account Recovery'}
            </div>
            <div className="text-sm text-slate-400">
              {step === 'email' && 'Enter your email to receive a recovery link'}
              {step === 'success' && 'We\'ve sent a password reset link to your email'}
            </div>
          </div>

          <div className="p-6 space-y-6 pt-6">
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2">
                {error}
              </div>
            )}
            {step === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#00d9ff] text-sm font-medium mb-2 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      onBlur={() => { if (email.trim()) { const err = validateEmail(email); if (err) setError(err); } }}
                      required
                      className="pl-10 h-12 bg-[#0a0e27] border-[#00d9ff]/30 text-white placeholder:text-gray-500 focus:border-[#00d9ff] focus:shadow-[0_0_15px_rgba(0,217,255,0.3)]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!email || isLoading}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-primary-border min-h-9 px-4 py-2 w-full h-12 bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-[0_0_20px_rgba(100,255,218,0.2)] hover:shadow-[0_0_25px_rgba(100,255,218,0.4)] mt-6 text-base"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Recovery Link
                      <Mail className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <p className="text-slate-300 mb-6">
                  Please click the link in the email sent to <strong>{email}</strong> to reset your password.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-primary-border min-h-9 px-4 py-2 w-full h-12 bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-[0_0_20px_rgba(100,255,218,0.2)] text-base opacity-100"
                >
                  Return to Login
                </button>
              </motion.div>
            )}
          </div>

          <div className="p-6 pb-6 pt-2 flex flex-col items-center gap-4 text-center">
            <div className="text-xs text-slate-500 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
              <Shield className="w-3 h-3 text-primary" />
              <span>Secure recovery process</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
