import { Shield, Search, Brain, FileText, AlertTriangle, Users, Mail, Linkedin, Github, Target, Lock } from 'lucide-react';
import { ExpandableFeatureCard } from '@/app/components/ExpandableFeatureCard';
import { InteractiveTeamSection } from '@/app/components/InteractiveTeamSection';

export function About() {
  const features = [
    {
      icon: Search,
      title: 'Instant Scam Detection',
      description: 'Real-time analysis of messages and URLs using advanced AI algorithms to identify potential scams.',
      details: [
        'Machine learning models trained on millions of scam patterns',
        'Real-time threat intelligence integration',
        'Multi-language support including English, Hindi, and Odia',
        'Instant risk scoring with detailed explanations'
      ]
    },
    {
      icon: Brain,
      title: 'Explainable AI Analysis',
      description: 'Get detailed breakdowns of why content is flagged, helping you understand the threats better.',
      details: [
        'Clear explanations for each detected threat',
        'Visual risk indicators and confidence scores',
        'Category-based classification (Phishing, OTP scams, etc.)',
        'Educational insights to improve your awareness'
      ]
    },
    {
      icon: Target,
      title: 'URL Risk Scoring',
      description: 'Comprehensive link analysis to detect malicious websites, phishing pages, and unsafe domains.',
      details: [
        'Domain reputation checking',
        'SSL certificate validation',
        'Blacklist database verification',
        'Redirect chain analysis for hidden threats'
      ]
    },
    {
      icon: FileText,
      title: 'One-click Reporting',
      description: 'Report scams quickly to help protect the community and build a comprehensive threat database.',
      details: [
        'Simple, user-friendly reporting interface',
        'Evidence attachment support (screenshots)',
        'Automatic classification and categorization',
        'Email notifications for report status'
      ]
    },
    {
      icon: Users,
      title: 'User Education System',
      description: 'Interactive quiz system to test and improve your cybersecurity awareness.',
      details: [
        'Practical scenario-based questions',
        'Progress tracking and performance analytics',
        'Personalized learning recommendations',
        'Regular quiz updates with new threat patterns'
      ]
    },
    {
      icon: Lock,
      title: 'Enterprise API Integration',
      description: 'Robust APIs for businesses to integrate ScamShield into their own platforms.',
      details: [
        'RESTful API with comprehensive documentation',
        'Secure authentication with token-based access',
        'Scalable infrastructure for high-volume requests',
        'Custom integration support for enterprise clients'
      ]
    },
  ];

  const teamMembers = [
    {
      name: 'Lanka Sneha',
      role: 'Team Leader',
      image: '/Sneha.jpeg',
      bio: 'System Architect. Responsible for the overall system design and technical strategy.',
      linkedin: 'https://www.linkedin.com/in/l-sneha-b66205295/',
      github: 'https://github.com/Sneha250904',
      email: 'sneha25092004@gmail.com',
    },
    {
      name: 'Abhijeet Soren',
      role: 'Backend Developer',
      image: '/Abhijeet.jpg',
      bio: 'Expert in server-side logic, API development, and secure database architecture.',
      linkedin: 'https://www.linkedin.com/in/abhijeet-soren-a7654b2b5/',
      github: 'https://github.com/Abhijxxt14',
      email: 'abhijeetsoren222@gmail.com',
    },
    {
      name: 'Jeeban Krushna Sahu',
      role: 'AI-ML Engineer',
      image: '/jeeban.jpeg',
      bio: 'Specializing in advanced AI algorithms and Machine Learning models for threat detection.',
      linkedin: 'https://www.linkedin.com/in/jeeban-krushna-sahu-004228301/',
      github: 'https://github.com/Jeeban-2006',
      email: 'jeebankrushnasahu1@gmail.com',
    },
    {
      name: 'Subhalaxmi Pradhan',
      role: 'Full Stack Developer',
      image: '/subhalaxmi.jpeg',
      bio: 'Building seamless, responsive, and user-friendly full-stack web applications.',
      linkedin: 'https://www.linkedin.com/in/subhalaxmi-pradhan-77b7043a2/',
      github: 'https://github.com/subha54820',
      email: 'pradhan.subhalaxmi9178@gmail.com',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27] pt-20 sm:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-[#00d9ff] drop-shadow-[0_0_12px_rgba(0,217,255,0.6)]" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
              About <span className="text-[#00d9ff]">ScamShield</span>
            </h1>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#00d9ff] to-transparent mx-auto"></div>
        </div>

        {/* About Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-[#0f1535] to-[#0a0e27] border border-[#00d9ff]/20 rounded-2xl p-8 sm:p-12 shadow-[0_0_40px_rgba(0,217,255,0.15)]">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#00d9ff]" />
              Our Mission
            </h2>
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                ScamShield is your comprehensive digital guardian designed to protect you from online scams, phishing attacks,
                and fraudulent activities. In an increasingly digital world, cybercriminals are constantly evolving their tactics
                to deceive unsuspecting victims.
              </p>
              <p>
                Our platform leverages cutting-edge machine learning algorithms and real-time threat intelligence to identify
                and alert you about potential scams before you fall victim. Whether it's a suspicious link, a phishing email,
                or a fraudulent message, ScamShield has you covered.
              </p>
              <p>
                We believe that everyone deserves to navigate the digital world safely and confidently. Our mission is to
                empower users with the tools and knowledge they need to protect themselves and their loved ones from online fraud.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our <span className="text-[#00d9ff]">Features</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive tools and services to keep you safe from online threats. Click on any feature to learn more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <ExpandableFeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                details={feature.details}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Meet Our <span className="text-[#00d9ff]">Team</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The passionate individuals working to keep you safe online
            </p>
          </div>

          <InteractiveTeamSection teamMembers={teamMembers} />
        </section>

        {/* Call to Action */}
        <section className="mt-20 text-center">
          <div className="bg-gradient-to-r from-[#00d9ff]/10 via-[#00d9ff]/5 to-[#00d9ff]/10 border border-[#00d9ff]/30 rounded-2xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to protect yourself from scams?
            </h2>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Join thousands of users who trust ScamShield to keep them safe online.
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#00d9ff] to-[#00a3cc] text-[#0a0e27] rounded-lg hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all font-semibold text-lg"
            >
              Get Started
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
