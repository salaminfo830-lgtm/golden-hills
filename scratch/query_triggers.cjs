const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.$queryRawUnsafe(`SELECT tgname, proname FROM pg_trigger JOIN pg_proc ON pg_proc.oid = pg_trigger.tgfoid WHERE tgrelid = 'auth.users'::regclass;`);
    console.log(res);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
