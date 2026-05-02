const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.pokemon.count()
  .then(count => {
    console.log('Total Pokémon:', count);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
