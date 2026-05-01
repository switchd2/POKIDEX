import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Generations
  const gens = [
    { number: 1, name: 'Generation I', region: 'Kanto', releaseYear: 1996, pokemonCount: 151 },
    { number: 2, name: 'Generation II', region: 'Johto', releaseYear: 1999, pokemonCount: 100 },
    { number: 3, name: 'Generation III', region: 'Hoenn', releaseYear: 2002, pokemonCount: 135 },
    { number: 4, name: 'Generation IV', region: 'Sinnoh', releaseYear: 2006, pokemonCount: 107 },
    { number: 5, name: 'Generation V', region: 'Unova', releaseYear: 2010, pokemonCount: 156 },
    { number: 6, name: 'Generation VI', region: 'Kalos', releaseYear: 2013, pokemonCount: 72 },
    { number: 7, name: 'Generation VII', region: 'Alola', releaseYear: 2016, pokemonCount: 88 },
    { number: 8, name: 'Generation VIII', region: 'Galar', releaseYear: 2019, pokemonCount: 96 },
    { number: 9, name: 'Generation IX', region: 'Paldea', releaseYear: 2022, pokemonCount: 120 },
  ];

  for (const gen of gens) {
    await prisma.generation.upsert({
      where: { number: gen.number },
      update: gen,
      create: gen,
    });
  }

  // Seed Types
  const types = [
    'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground',
    'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
  ];

  for (const type of types) {
    await prisma.type.upsert({
      where: { name: type.toLowerCase() },
      update: {},
      create: {
        name: type.toLowerCase(),
        nameDisplay: type.toUpperCase(),
        strongAgainst: [],
        weakAgainst: [],
        immuneTo: [],
      },
    });
  }

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
