import { motion } from 'framer-motion';
import { Shield, FileText, ChevronLeft } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const LegalPages = ({ type = 'privacy' }) => {
  const content = {
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Your security and confidentiality are our highest priorities.',
      text: 'At Golden Hills Hotel Setif, we are committed to protecting the personal information of our guests. This policy outlines how we collect, use, and protect your data during your stay and through our digital platforms.',
      sections: [
        { h: 'Data Collection', p: 'We collect information such as your name, contact details, and payment information to facilitate your booking and provide a personalized experience.' },
        { h: 'Security Measures', p: 'Our systems use advanced encryption and glass-secure protocols to ensure your data remains protected from unauthorized access.' },
        { h: 'Cookies', p: 'Our website uses cookies to enhance user experience and analyze traffic patterns anonymously.' }
      ]
    },
    terms: {
      title: 'Terms of Service',
      subtitle: 'Guidelines for a harmonious and luxury stay.',
      text: 'By booking a stay at Golden Hills Hotel, you agree to abide by our house rules designed to maintain the prestige and comfort of all our guests.',
      sections: [
        { h: 'Bookings', p: 'Reservations are subject to availability and payment verification. A valid ID is required at check-in.' },
        { h: 'Cancellations', p: 'Cancellations must be made at least 24 hours in advance to avoid a service fee.' },
        { h: 'House Rules', p: 'We maintain a noise-free environment in our suites after 22:00 to ensure the rest of all patrons.' }
      ]
    },
    security: {
      title: 'Security Policy',
      subtitle: 'Ensuring your safety and physical security during your stay.',
      text: 'Golden Hills Hotel employs state-of-the-art security measures to provide a safe haven for our guests.',
      sections: [
        { h: 'Physical Security', p: '24/7 surveillance and professional security personnel are stationed throughout the premises.' },
        { h: 'Digital Protection', p: 'Our guest network is secured with enterprise-grade firewalls and monitoring.' },
        { h: 'Emergency Response', p: 'All staff are trained in emergency protocols to ensure rapid and efficient response when needed.' }
      ]
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about your luxury experience.',
      text: 'Find answers to common questions about staying at Golden Hills Hotel.',
      sections: [
        { h: 'What are the check-in and check-out times?', p: 'Check-in is from 15:00, and check-out is before 11:00. Late check-out may be available upon request.' },
        { h: 'Do you offer airport shuttle services?', p: 'Yes, we provide luxury airport transfers. Please contact our concierge to arrange your pick-up.' },
        { h: 'Is parking available on-site?', p: 'We offer complimentary valet parking in our secure underground garage for all guests.' }
      ]
    }
  };

  const active = content[type];

  return (
    <div className="min-h-screen bg-luxury-white-warm text-luxury-black font-sans">
      <nav className="p-6 flex items-center justify-between glass sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 text-luxury-gold hover:text-luxury-black transition-colors font-bold">
          <ChevronLeft className="w-5 h-5" /> Back to Home
        </Link>
        <Logo textVisible={false} className="w-8 h-8" />
      </nav>

      <div className="container mx-auto px-6 py-24 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
           <div className="text-center space-y-4">
              <div className="inline-flex p-3 glass-gold rounded-2xl text-luxury-gold mb-6">
                 {type === 'privacy' ? <Shield className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
              </div>
              <h1 className="text-5xl font-serif font-bold tracking-tight">{active.title}</h1>
              <p className="text-lg text-gray-400 font-medium italic">{active.subtitle}</p>
           </div>

           <GlassCard className="bg-white border-gray-100 p-12 shadow-sm leading-relaxed">
              <p className="text-gray-600 mb-10 pb-10 border-b border-gray-50">{active.text}</p>
              
              <div className="space-y-10">
                 {active.sections.map((section, i) => (
                   <div key={i} className="space-y-2">
                      <h3 className="text-xl font-serif font-bold tracking-tight">{section.h}</h3>
                      <p className="text-gray-500 font-medium">{section.p}</p>
                   </div>
                 ))}
              </div>
           </GlassCard>

           <div className="text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest pt-10">
              Last updated: April 2026 • Golden Hills Hotel Setif
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalPages;
