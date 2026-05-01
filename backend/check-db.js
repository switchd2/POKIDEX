const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const count = await prisma.pokemon.count();
    console.log(`POKEMON_COUNT: ${count}`);
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

check();
