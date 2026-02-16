import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { Shield, Lock, CheckCircle } from 'lucide-react';

interface CyberLoadingAnimationProps {
  onComplete: () => void;
}

export function CyberLoadingAnimation({ onComplete }: CyberLoadingAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'scanning' | 'verifying' | 'complete'>('scanning');
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    console.log('🎬 CyberLoadingAnimation mounted - starting animation');
    const container = containerRef.current;
    if (!container) return;

    // Set up the animation timeline
    const tl = gsap.timeline();

    // Matrix effect background
    const cleanupMatrix = createMatrixBackground(container);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (0.5 + Math.random() * 2);

        if (next >= 100) {
          clearInterval(progressInterval);

          // Trigger completion sequence
          setTimeout(() => {
            setShowAnimation(false);
            setTimeout(onComplete, 300);
          }, 500);

          return 100;
        }

        // Update stage based on progress
        if (next > 70) setStage('complete');
        else if (next > 40) setStage('verifying');

        return next;
      });
    }, 100);

    // Shield animation
    const shield = container.querySelector('.shield-icon');
    if (shield) {
      tl.from(shield, {
        scale: 0,
        rotation: -180,
        duration: 0.6,
        ease: 'back.out(1.7)'
      });

      tl.to(shield, {
        rotation: 360,
        duration: 2,
        ease: 'linear',
        repeat: -1
      });
    }

    // Scanning lines animation
    const scanLines = container.querySelectorAll('.scan-line');
    scanLines.forEach((line, i) => {
      gsap.to(line, {
        scaleX: 1,
        duration: 0.8,
        delay: i * 0.1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    });

    return () => {
      clearInterval(progressInterval);
      tl.kill();
      if (cleanupMatrix) cleanupMatrix();
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0e27]"
          ref={containerRef}
        >
          {/* Background grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(#00d9ff 1px, transparent 1px), linear-gradient(90deg, #00d9ff 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center space-y-8">
            {/* Shield icon with glow */}
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-[#00d9ff] opacity-50 rounded-full" />
              <div className="shield-icon relative">
                <Shield
                  className="w-24 h-24 text-[#00d9ff]"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(0, 217, 255, 0.8))'
                  }}
                />
                {stage === 'complete' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Status text */}
            <div className="text-center space-y-2">
              <motion.h2
                key={stage}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-white"
              >
                {stage === 'scanning' && 'Scanning System'}
                {stage === 'verifying' && 'Verifying Secure Access'}
                {stage === 'complete' && 'Access Granted'}
              </motion.h2>
              <p className="text-[#00d9ff] text-sm font-mono">
                {Math.round(progress)}% Complete
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-80 h-2 bg-[#1a1f3a] rounded-full overflow-hidden border border-[#00d9ff]/30">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00d9ff] to-[#00ff88]"
                style={{
                  width: `${progress}%`,
                  boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
                }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Scanning lines */}
            <div className="space-y-2 w-80">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div
                    className="scan-line h-0.5 bg-[#00d9ff] origin-left"
                    style={{
                      transform: 'scaleX(0)',
                      boxShadow: '0 0 5px rgba(0, 217, 255, 0.5)'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Security indicators */}
            <div className="flex space-x-6 text-gray-400">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 30 ? 1 : 0.3 }}
                className="flex items-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span className="text-xs font-mono">ENCRYPTED</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 60 ? 1 : 0.3 }}
                className="flex items-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span className="text-xs font-mono">SECURED</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Create matrix-style falling characters background
 */
function createMatrixBackground(container: HTMLElement) {
  const chars = '01';
  const canvas = document.createElement('canvas');
  canvas.className = 'absolute inset-0 opacity-20';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;
  const columns = Math.floor(canvas.width / 20);
  // Randomize starting positions to prevent the initial "wall" of falling text
  const drops: number[] = Array(columns).fill(0).map(() => Math.floor(Math.random() * -15));

  const draw = () => {
    // Clear the canvas slightly to create the trail effect
    ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00d9ff';
    ctx.font = '12px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * 20, drops[i] * 20);

      if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  };

  // Slower speed for smoother appearance (was 50ms)
  const interval = setInterval(draw, 50);

  return () => {
    clearInterval(interval);
    container.removeChild(canvas);
  };
}
