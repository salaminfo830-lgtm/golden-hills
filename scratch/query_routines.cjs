const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.$queryRawUnsafe(`SELECT routine_schema, routine_name FROM information_schema.routines WHERE routine_schema IN ('auth', 'public') AND routine_name NOT LIKE 'pg_%' AND routine_name NOT LIKE 'prisma_%';`);
    console.log(res);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
