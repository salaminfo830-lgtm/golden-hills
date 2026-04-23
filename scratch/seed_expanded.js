
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Expanded Seeding (v3) ---');

  // 1. Settings
  await prisma.settings.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      hotel_name: 'Golden Hills Luxury Hotel',
      contact_email: 'concierge@goldenhills.dz',
      contact_phone: '+213 36 00 00 00',
      address: 'High Plateau, Sétif, Algeria',
      currency: 'DZD',
      timezone: '(GMT+01:00) Algiers',
      brand_color_primary: '#D4AF37',
      hero_image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070',
      logo_url: ''
    }
  });

  // 2. Rooms
  const rooms = [
    {
      number: '101',
      type: 'Heritage Deluxe',
      price: 320,
      status: 'Vacant',
      occupancy: 'Clean',
      description: 'A sanctuary of Algerian elegance with panoramic views of the high plateau.',
      capacity: 2,
      image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070',
      gallery: [
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=2070',
        'https://images.unsplash.com/photo-1590490360182-c33d59735288?auto=format&fit=crop&q=80&w=1974'
      ],
      features: ['King Bed', 'City View', 'Marble Bath']
    },
    {
      number: '201',
      type: 'Junior Suite',
      price: 550,
      status: 'Vacant',
      occupancy: 'Clean',
      description: 'Expanded living space with refined traditional decor and modern tech.',
      capacity: 3,
      image_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=2070',
      gallery: [
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=2070',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=2070'
      ],
      features: ['Separate Living Area', 'Mountain View', 'Breakfast Included']
    },
    {
      number: '501',
      type: 'Royal Suite',
      price: 1200,
      status: 'Vacant',
      occupancy: 'Clean',
      description: 'The pinnacle of luxury in Setif. Absolute privacy with 24/7 butler service.',
      capacity: 4,
      image_url: 'https://images.unsplash.com/photo-1590490360182-c33d59735288?auto=format&fit=crop&q=80&w=1974',
      gallery: [
        'https://images.unsplash.com/photo-1590490360182-c33d59735288?auto=format&fit=crop&q=80&w=1974',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=2070'
      ],
      features: ['Private Hammam', 'Panoramic Balcony', 'Chauffeur Service']
    }
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { number: room.number },
      update: room,
      create: room
    });
  }

  // 3. Guests
  const guests = [
    {
      full_name: 'Elena Romanov',
      email: 'elena.r@luxury.com',
      phone: '+44 7700 900000',
      nationality: 'British',
      id_number: 'P1234567',
      dob: new Date('1985-05-15'),
      address: '12 Kensington High St, London'
    },
    {
      full_name: 'Mourad Brahimi',
      email: 'mourad.b@business.dz',
      phone: '+213 550 11 22 33',
      nationality: 'Algerian',
      id_number: '0987654321',
      dob: new Date('1978-11-20'),
      address: 'Cité El Eulma, Sétif'
    }
  ];

  for (const guest of guests) {
    await prisma.guest.upsert({
      where: { email: guest.email },
      update: guest,
      create: guest
    });
  }

  // 4. Staff (Use delete + create for safety on non-unique names)
  await prisma.staff.deleteMany({});
  await prisma.staff.createMany({
    data: [
      {
        name: 'Amina K.',
        role: 'Lead Housekeeper',
        department: 'Housekeeping',
        status: 'On Shift',
        email: 'amina.k@goldenhills.dz',
        salary: 2800,
        joined_date: new Date('2025-01-10')
      },
      {
        name: 'Sofiane L.',
        role: 'Executive Chef',
        department: 'Kitchen',
        status: 'Off Shift',
        email: 'sofiane.l@goldenhills.dz',
        salary: 4500,
        joined_date: new Date('2024-11-05')
      }
    ]
  });

  // 5. Services
  await prisma.service.deleteMany({});
  await prisma.service.createMany({
    data: [
      {
        name: 'The Golden Terrace',
        type: 'Dining',
        description: 'Fine dining experience featuring local Sétifian ingredients with a modern twist.',
        image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070',
        hours: '19:00 - 23:00',
        location: '5th Floor Terrace',
        specialty: 'Saffron Braised Lamb',
        price: 'Premium'
      },
      {
        name: 'Atlas Wellness Spa',
        type: 'Spa',
        description: 'Traditional Hammam and modern hydrotherapy treatments.',
        image_url: 'https://images.unsplash.com/photo-1544161515-4af6b1d46152?auto=format&fit=crop&q=80&w=2070',
        hours: '09:00 - 21:00',
        location: 'B1 Floor',
        specialty: 'Argan Oil Hammam',
        price: 'Luxury'
      }
    ]
  });

  // 6. Stock Items
  await prisma.stockItem.deleteMany({});
  await prisma.stockItem.createMany({
    data: [
      { name: 'Egyptian Cotton Sheets', level: '85%', status: 'Regular', category: 'Housekeeping' },
      { name: 'Argan Therapy Oil', level: '12%', status: 'Critical', category: 'Spa' },
      { name: 'Vintage Selection Wine', level: '45%', status: 'Low', category: 'Bar' }
    ]
  });

  console.log('--- Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
