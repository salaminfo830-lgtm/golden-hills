import { motion } from 'framer-motion';
import { UtensilsCrossed, Clock, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import GoldButton from '../components/GoldButton';

const DiningPage = () => {
  const venues = [
    {
      name: 'The Grand Saffron',
      type: 'Fine Algerian Dining',
      desc: 'Experience the rich flavors of traditional Algerian cuisine reimagined with modern culinary techniques.',
      img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070',
      hours: '19:00 - 23:00'
    },
    {
      name: 'Gold Lounge',
      type: 'Artisanal Coffee & Pastry',
      desc: 'A sun-drenched sanctuary offering the finest Setif coffee and delicate gold-leafed pastries.',
      img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=2047',
      hours: '08:00 - 18:00'
    },
    {
      name: 'The Hillside Grill',
      type: 'Outdoor Terrace',
      desc: 'Panoramic views and grilled specialties under the stars. Perfect for breezy evening gatherings.',
      img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1974',
      hours: '12:00 - 22:00'
    }
  ];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-luxury-white-warm text-luxury-black font-sans">
      <nav className="p-6 flex justify-between items-center glass sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <Logo textVisible={false} className="w-8 h-8" />
          <span className="font-serif font-bold text-xl tracking-tighter">GOLDEN HILLS</span>
        </Link>
        <GoldButton outline className="px-6 py-2 text-[10px]" onClick={() => navigate('/#contact')}>RESERVE A TABLE</GoldButton>
      </nav>

      <section className="container mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
           <h4 className="text-luxury-gold font-serif italic text-xl mb-4">Epicurean Journeys</h4>
           <h1 className="text-4xl md:text-7xl font-serif font-bold tracking-tight mb-8">Setif&apos;s Finest Flavors</h1>
           <p className="max-w-2xl mx-auto text-gray-500 text-lg">From traditional Saffron-infused masterpieces to contemporary Mediterranean delights, our culinary offerings define luxury dining in Algeria.</p>
        </motion.div>

        <div className="space-y-32">
           {venues.map((venue, i) => (
             <div key={i} className={`flex flex-col ${i % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-20 items-center`}>
                <div className="flex-1 w-full">
                   <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl relative"
                   >
                      <img src={venue.img} className="w-full h-full object-cover" alt={venue.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                   </motion.div>
                </div>
                <div className="flex-1 space-y-8">
                   <div className="space-y-2">
                      <span className="text-luxury-gold font-bold uppercase tracking-[0.3em] text-[10px]">{venue.type}</span>
                      <h2 className="text-4xl md:text-5xl font-serif font-bold">{venue.name}</h2>
                   </div>
                   <p className="text-gray-600 leading-relaxed text-lg font-medium">
                      {venue.desc}
                   </p>
                   <div className="flex gap-10 py-6 border-y border-gray-100">
                      <div className="flex items-center gap-3">
                         <div className="p-2 glass rounded-lg text-luxury-gold"><Clock className="w-4 h-4" /></div>
                         <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Hours</p>
                            <p className="text-sm font-bold">{venue.hours}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="p-2 glass rounded-lg text-luxury-gold"><MapPin className="w-4 h-4" /></div>
                         <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Location</p>
                            <p className="text-sm font-bold">Lobby Floor</p>
                         </div>
                      </div>
                   </div>
                   <GoldButton className="px-10">VIEW MENU</GoldButton>
                </div>
             </div>
           ))}
        </div>
      </section>

      <section className="bg-luxury-black py-32 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 gold-gradient opacity-10 blur-[120px] -mr-48 -mt-48" />
         <div className="container mx-auto px-6 text-center relative z-10">
            <UtensilsCrossed className="w-12 h-12 text-luxury-gold mx-auto mb-8" />
            <h2 className="text-4xl font-serif font-bold mb-8 italic">Private Gastronomy</h2>
            <p className="text-white/60 max-w-xl mx-auto mb-12">Hosting an event or a private celebration? Our chef will curate a custom menu tailored to your preferences, served in our exclusive VIP suites.</p>
            <GoldButton outline className="border-white/20 text-white hover:bg-white hover:text-luxury-black">INQUIRE ABOUT EVENTS</GoldButton>
         </div>
      </section>
    </div>
  );
};

export default DiningPage;
