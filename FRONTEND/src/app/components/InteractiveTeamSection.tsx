import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Linkedin, Github } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  linkedin: string;
  github: string;
  email: string;
}

interface InteractiveTeamSectionProps {
  teamMembers: TeamMember[];
}

export function InteractiveTeamSection({ teamMembers }: InteractiveTeamSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(true);
  };

  return (
    <div className="relative min-h-[600px] flex items-center justify-center">
      {/* Initial container card */}
      {!isExpanded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="cursor-pointer"
          onClick={handleClick}
        >
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#0f1535] to-[#0a0e27] border-2 border-[#00d9ff]/30 rounded-2xl p-12 hover:border-[#00d9ff]/60 hover:shadow-[0_0_50px_rgba(0,217,255,0.3)] transition-all duration-300 group">
            <div className="text-center space-y-6">
              <motion.div
                animate={{ 
                  rotate: [0, -5, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="mx-auto w-24 h-24 rounded-full bg-[#00d9ff]/10 flex items-center justify-center border-2 border-[#00d9ff]/30 group-hover:border-[#00d9ff]/60 transition-all"
              >
                <svg 
                  className="w-12 h-12 text-[#00d9ff]" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
              </motion.div>

              <div>
                <h3 className="text-3xl font-bold text-white mb-3">
                  Want to See Our <span className="text-[#00d9ff]">Teammates</span>?
                </h3>
                <p className="text-gray-400 text-lg">
                  Click to meet the brilliant minds behind ScamShield
                </p>
              </div>

              <motion.div
                animate={{ 
                  y: [0, -10, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="text-[#00d9ff]"
              >
                <svg 
                  className="w-8 h-8 mx-auto" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 13l-7 7-7-7m14-8l-7 7-7-7" 
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Team cards - simple side by side layout */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group bg-gradient-to-b from-[#0f1535] to-[#0a0e27] border border-[#00d9ff]/20 rounded-xl overflow-hidden hover:border-[#00d9ff]/50 hover:shadow-[0_0_30px_rgba(0,217,255,0.2)] transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-transparent to-transparent opacity-60"></div>
                </div>
                <div className="p-6 relative">
                  {/* Hover overlay to reveal info */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform translate-y-2 group-hover:translate-y-0">
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-[#00d9ff] text-sm font-medium mb-3">{member.role}</p>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{member.bio}</p>
                    <div className="flex items-center gap-3">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-[#00d9ff]/10 rounded-lg hover:bg-[#00d9ff]/20 transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4 text-[#00d9ff]" />
                      </a>
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-[#00d9ff]/10 rounded-lg hover:bg-[#00d9ff]/20 transition-colors"
                        aria-label="GitHub"
                      >
                        <Github className="w-4 h-4 text-[#00d9ff]" />
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 bg-[#00d9ff]/10 rounded-lg hover:bg-[#00d9ff]/20 transition-colors"
                        aria-label="Email"
                      >
                        <Mail className="w-4 h-4 text-[#00d9ff]" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
