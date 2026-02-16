import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { LucideIcon } from 'lucide-react';

interface ExpandableFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
  index: number;
}

export function ExpandableFeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  details,
  index 
}: ExpandableFeatureCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!detailsRef.current) return;

    const element = detailsRef.current;
    const ctx = gsap.context(() => {
      if (isExpanded) {
        gsap.to(element, {
          height: 'auto',
          opacity: 1,
          duration: 0.4,
          ease: 'power2.inOut'
        });
      } else {
        gsap.to(element, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut'
        });
      }
    });

    return () => ctx.revert();
  }, [isExpanded]);

  const handleToggle = () => {
    if (cardRef.current) {
      // Pulse effect on click
      gsap.to(cardRef.current, {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group bg-[#0f1535] border rounded-xl p-6 transition-all duration-300 cursor-pointer ${
        isExpanded 
          ? 'border-[#00d9ff]/50 shadow-[0_0_30px_rgba(0,217,255,0.3)]' 
          : 'border-[#00d9ff]/20 hover:border-[#00d9ff]/40 hover:shadow-[0_0_20px_rgba(0,217,255,0.15)]'
      }`}
      onClick={handleToggle}
    >
      <div className="flex items-start gap-4">
        <motion.div 
          className={`p-3 rounded-lg transition-all duration-300 ${
            isExpanded 
              ? 'bg-[#00d9ff]/30 shadow-[0_0_15px_rgba(0,217,255,0.4)]' 
              : 'bg-[#00d9ff]/10 group-hover:bg-[#00d9ff]/20'
          }`}
          animate={isExpanded ? { 
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.05, 1]
          } : {}}
          transition={{ duration: 0.5 }}
        >
          <Icon className={`w-6 h-6 transition-all duration-300 ${
            isExpanded ? 'text-[#00d9ff] scale-110' : 'text-[#00d9ff]'
          }`} />
        </motion.div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-white group-hover:text-[#00d9ff] transition-colors">
              {title}
            </h3>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-[#00d9ff]"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </motion.div>
          </div>
          
          <p className="text-gray-400 text-sm leading-relaxed mb-2">
            {description}
          </p>

          {/* Expandable details */}
          <div
            ref={detailsRef}
            className="overflow-hidden"
            style={{ height: 0, opacity: 0 }}
          >
            <div className="pt-4 mt-4 border-t border-[#00d9ff]/20">
              <h4 className="text-sm font-semibold text-[#00d9ff] mb-3">
                Key Features:
              </h4>
              <ul className="space-y-2">
                {details.map((detail, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isExpanded ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="flex items-start gap-2 text-gray-300 text-sm"
                  >
                    <span className="text-[#00d9ff] mt-1">▹</span>
                    <span>{detail}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
