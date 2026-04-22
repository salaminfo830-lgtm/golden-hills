import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const diningVenues = [
  {
    name: 'Atlas Sky Lounge',
    type: 'Dining',
    description: 'Panoramic views of Sétif with signature cocktails and a sophisticated atmosphere. Perched on the 12th floor, it offers the city’s most dramatic sunsets.',
    hours: '18:00 - 01:00',
    location: 'Rooftop Sanctuary',
    specialty: 'Saffron Martini',
    image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070'
  },
  {
    name: 'The Heritage Kitchen',
    type: 'Dining',
    description: 'A contemporary dialogue with traditional Algerian flavors. Our chefs utilize hill-grown spices and artisanal techniques to create modern masterpieces.',
    hours: '07:00 - 23:00',
    location: 'Grand Lobby Level',
    specialty: 'Slow-cooked Hillside Couscous',
    image_url: 'https://images.unsplash.com/photo-1550966842-2849a2249821?auto=format&fit=crop&q=80&w=2070'
  },
  {
    name: 'Saffron Courtyard',
    type: 'Dining',
    description: 'An open-air oasis for afternoon tea and light mezze. Surrounded by jasmine and trickling fountains, it is the hotel’s quietest retreat.',
    hours: '10:00 - 20:00',
    location: 'Inner Courtyard',
    specialty: 'Numidian Mint Tea',
    image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=2074'
  }
];

const spaServices = [
  {
    name: 'Numidian Spa & Rituals',
    type: 'Spa',
    description: 'Ancient healing rituals utilizing local botanical oils and heated Atlas stones. A sanctuary designed for total restoration of the spirit.',
    hours: '09:00 - 21:00',
    location: 'Wellness Level',
    specialty: 'Atlas Stone Massage',
    image_url: 'https://images.unsplash.com/photo-1544161515-436cefb6579a?auto=format&fit=crop&q=80&w=2070'
  },
  {
    name: 'The Royal Hammam',
    type: 'Spa',
    description: 'A traditional steam experience redefined with gold-leaf accents and personalized aromatherapy. Pure atmosphere for profound stillness.',
    hours: '09:00 - 21:00',
    location: 'Wellness Level',
    specialty: 'Gold-Dust Scrub',
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=2070'
  }
];

async function seed() {
  console.log('🚀 Seeding foundational data...');

  // Clear existing
  await supabase.from('Service').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 1. Seed Dining
  const { error: dError } = await supabase.from('Service').insert(diningVenues);
  if (dError) console.error('❌ Error seeding Dining:', dError);
  else console.log('✅ Dining venues seeded.');

  // 2. Seed Spa
  const { error: sError } = await supabase.from('Service').insert(spaServices);
  if (sError) console.error('❌ Error seeding Spa:', sError);
  else console.log('✅ Spa services seeded.');

  console.log('✨ Seeding complete!');
}

seed();
