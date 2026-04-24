import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const hotelSettings = {
  id: 'global',
  hotel_name: 'Hôtel Golden Hills',
  address: "Rue Champs d'azur, Sétif 19000, Algeria",
  contact_email: 'hotelgoldenhillsreservation@gmail.com',
  contact_phone: '030 793 030 / 07 70 51 53 59',
  currency: 'DZD',
  timezone: '(GMT+01:00) Algiers, Casablanca, Tunis',
  brand_color_primary: '#D4AF37',
  brand_color_secondary: '#002349',
  updated_at: new Date().toISOString()
};

const rooms = [
  {
    number: '101',
    type: 'Queen Room',
    price: 18000,
    description: 'Contemporary design with traditional Algerian touches. Features Select Comfort beds and Egyptian cotton sheets.',
    image_url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=2070',
    capacity: 2,
    features: ['Select Comfort Bed', 'Egyptian Cotton Sheets', 'Plasma TV', 'Minibar', 'Safe', 'WiFi'],
    status: 'Vacant',
    updated_at: new Date().toISOString()
  },
  {
    number: '201',
    type: 'King Suite with Living Room',
    price: 35000,
    description: 'Spacious suite featuring a separate living area with a sofa bed. Luxury meets comfort with premium amenities.',
    image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=2070',
    capacity: 3,
    features: ['Sofa Bed', 'Living Room', 'Select Comfort Bed', 'Plasma TV', 'Coffee & Tea Facilities', 'Minibar'],
    status: 'Vacant',
    updated_at: new Date().toISOString()
  },
  {
    number: '301',
    type: 'Multi-Bedroom Suite',
    price: 75000,
    description: 'Expansive multi-bedroom residence (up to 5 bedrooms available) designed for families or groups seeking ultimate luxury.',
    image_url: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=2070',
    capacity: 6,
    features: ['Multiple Bedrooms', 'Private Kitchenette', 'Dining Area', 'Premium WiFi', 'Luxury Bathrooms', 'City Views'],
    status: 'Vacant',
    updated_at: new Date().toISOString()
  }
];

const services = [
  {
    id: crypto.randomUUID(),
    name: 'Main Restaurant',
    type: 'Dining',
    description: 'Authentic Algerian cuisine paired with international dishes in an elegant setting.',
    hours: '06:00 - 23:00',
    location: 'Lobby Level',
    specialty: 'Traditional Algerian Tagine',
    image_url: 'https://images.unsplash.com/photo-1550966842-2849a2249821?auto=format&fit=crop&q=80&w=2070',
    created_at: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    name: 'Golden Hills Café',
    type: 'Dining',
    description: 'One of our two on-site coffee shops offering artisanal coffee and local pastries.',
    hours: '08:00 - 22:00',
    location: 'Lobby',
    specialty: 'Signature Algerian Coffee',
    image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=2074',
    created_at: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    name: 'Hillside Coffee Shop',
    type: 'Dining',
    description: 'The second on-site café, perfect for a quick snack or a relaxing afternoon tea.',
    hours: '07:00 - 21:00',
    location: 'Garden Level',
    specialty: 'Numidian Mint Tea',
    image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070',
    created_at: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    name: 'Full-Service Spa',
    type: 'Spa',
    description: 'Massages, traditional hammam, and modern treatments. Advance reservation required.',
    hours: '09:00 - 21:00',
    location: 'Wellness Level',
    specialty: 'Traditional Hammam Ritual',
    image_url: 'https://images.unsplash.com/photo-1544161515-436cefb6579a?auto=format&fit=crop&q=80&w=2070',
    created_at: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    name: 'Fitness Center',
    type: 'Spa',
    description: 'Equipped with modern fitness machines for your daily workout routine.',
    hours: '24/7',
    location: 'Wellness Level',
    specialty: 'Modern Cardio Equipment',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2070',
    created_at: new Date().toISOString()
  }
];

async function updateData() {
  console.log('🚀 Updating database with real Golden Hills data...');

  // 1. Update Settings
  const { error: settingsError } = await supabase
    .from('Settings')
    .upsert([hotelSettings]);
  
  if (settingsError) console.error('❌ Settings update error:', settingsError);
  else console.log('✅ Settings updated.');

  // 2. Clear Rooms (use a filter that matches all, e.g., number is not null)
  console.log('🧹 Clearing existing rooms...');
  const { error: deleteRoomsError } = await supabase.from('Room').delete().not('number', 'is', null);
  if (deleteRoomsError) {
     console.error('❌ Error clearing rooms:', deleteRoomsError);
     // Try alternative if 'not' doesn't work well
     const { error: altDeleteError } = await supabase.from('Room').delete().neq('number', 'NON_EXISTENT');
     if (altDeleteError) console.error('❌ Alternative clear failed:', altDeleteError);
  }

  const { error: roomsError } = await supabase.from('Room').insert(rooms);
  if (roomsError) console.error('❌ Rooms insertion error:', roomsError);
  else console.log('✅ Rooms updated.');

  // 3. Services already updated successfully in previous run, but we'll do it again for consistency
  console.log('🧹 Clearing existing services...');
  await supabase.from('Service').delete().not('name', 'is', null);
  const { error: servicesError } = await supabase.from('Service').insert(services);
  if (servicesError) console.error('❌ Services insertion error:', servicesError);
  else console.log('✅ Services updated.');

  console.log('✨ Database update complete!');
}

updateData();
