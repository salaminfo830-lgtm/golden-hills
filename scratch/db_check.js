
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  try {
    const rooms = await prisma.room.count();
    const guests = await prisma.guest.count();
    const staff = await prisma.staff.count();
    const services = await prisma.service.count();
    
    console.log('--- Database Status ---');
    console.log(`Rooms: ${rooms}`);
    console.log(`Guests: ${guests}`);
    console.log(`Staff: ${staff}`);
    console.log(`Services: ${services}`);
    
    if (rooms > 0) {
      const firstRoom = await prisma.room.findFirst();
      console.log('First Room Sample:', JSON.stringify(firstRoom, null, 2));
    }
  } catch (e) {
    console.error('Check failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

check();
