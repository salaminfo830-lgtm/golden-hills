import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Golden Hills Database Initialization ---')

  // 1. Clean up (as requested: "delete all test data")
  await prisma.reservation.deleteMany({})
  await prisma.task.deleteMany({})
  await prisma.kitchenOrder.deleteMany({})
  await prisma.stockItem.deleteMany({})
  await prisma.securityLog.deleteMany({})
  await prisma.financeTransaction.deleteMany({})
  await prisma.room.deleteMany({})
  await prisma.staff.deleteMany({})

  console.log('✓ Cleared old data')

  // 2. Create Real Rooms (Based on Dining/Suites content)
  const suites = [
    { number: '101', name: 'Royal Gold Suite', price: 450, type: 'Signature', img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39' },
    { number: '102', name: 'Heritage Deluxe', price: 320, type: 'Premium', img: 'https://images.unsplash.com/photo-1590490360182-c33d59735288' },
    { number: '201', name: 'Presidential Panorama', price: 850, type: 'Elite', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b' },
    { number: '202', name: 'Executive Hillside', price: 280, type: 'Business', img: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6' },
    { number: '301', name: 'Sapphire Garden Room', price: 190, type: 'Standard', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304' },
    { number: '302', name: 'Imperial Family Wing', price: 550, type: 'Group', img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a' },
  ]

  for (const suite of suites) {
    await prisma.room.create({
      data: {
        number: suite.number,
        type: suite.name,
        price: suite.price,
        image_url: suite.img,
        status: 'Vacant',
        occupancy: 'Clean'
      }
    })
  }
  console.log('✓ Provisioned hotel suites')

  // 3. Create Key Staff
  const staff = [
    { name: 'Fares Ahmed', role: 'General Manager', department: 'Administration', status: 'On Shift' },
    { name: 'Sarah L.', role: 'Head of Housekeeping', department: 'Housekeeping', status: 'On Shift' },
    { name: 'Chef Mourad', role: 'Executive Chef', department: 'Kitchen', status: 'On Shift' },
    { name: 'Karim Z.', role: 'Chief of Security', department: 'Security', status: 'On Shift' },
  ]

  for (const s of staff) {
    await prisma.staff.create({ data: s })
  }
  console.log('✓ Initialized core staff')

  // 4. Initial Stock
  const inventory = [
    { name: 'Saffron Threads (Local)', level: '450g', status: 'Regular', category: 'Kitchen' },
    { name: 'Carrara Marble Polish', level: '12L', status: 'Low', category: 'Housekeeping' },
    { name: 'Egyptian Cotton Linens', level: '120 Units', status: 'Regular', category: 'Housekeeping' },
  ]
  for (const item of inventory) {
    await prisma.stockItem.create({ data: item })
  }
  console.log('✓ Set up kitchen & housekeeping inventory')

  console.log('--- Initialization Complete ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
