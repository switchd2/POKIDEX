import { PrismaClient } from '@prisma/client';
import { RawPokemonData } from '../scraper/sources/bulbapedia.scraper';
import { slugify } from '../utils/slugify';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export async function upsertPokemon(name: string, data: RawPokemonData) {
  const slug = slugify(name);
  const { infobox, biology, origin, stats, evolution, learnset } = data;

  // Find Generation ID
  const generation = await prisma.generation.findFirst({
    where: { number: infobox.generation || 1 } // Fallback to 1 if not found
  });

  return await prisma.pokemon.upsert({
    where: { slug },
    update: {
      nationalDex: infobox.nationalDex,
      name,
      nameJapanese: infobox.nameJapanese,
      genus: infobox.genus,
      height: infobox.height,
      weight: infobox.weight,
      catchRate: infobox.catchRate,
      baseFriendship: infobox.baseFriendship,
      baseExp: infobox.baseExp,
      growthRate: infobox.growthRate,
      genderRatio: infobox.genderRatio,
      hatchTime: infobox.hatchTime,
      description: biology.description,
      designOrigin: origin.designOrigin,
      nameEtymology: origin.nameEtymology,
      // Types
      types: {
        deleteMany: {},
        create: await Promise.all((infobox.types || []).map(async (typeName: string, index: number) => {
          const type = await prisma.type.findUnique({ where: { name: typeName.toLowerCase() } });
          return {
            typeId: type?.id || 1,
            slot: index + 1
          };
        }))
      },
      // Stats
      stats: {
        deleteMany: {},
        create: Object.entries(stats).map(([statName, baseValue]: [string, any]) => ({
          statName,
          baseValue,
          effort: 0 // TODO: extract EV yield
        }))
      }
    },
    create: {
      id: infobox.nationalDex,
      nationalDex: infobox.nationalDex,
      slug,
      name,
      nameJapanese: infobox.nameJapanese,
      genus: infobox.genus,
      generationId: generation?.id || 1,
      height: infobox.height,
      weight: infobox.weight,
      catchRate: infobox.catchRate,
      baseFriendship: infobox.baseFriendship,
      baseExp: infobox.baseExp,
      growthRate: infobox.growthRate,
      genderRatio: infobox.genderRatio,
      hatchTime: infobox.hatchTime,
      description: biology.description,
      designOrigin: origin.designOrigin,
      nameEtymology: origin.nameEtymology,
      // Types
      types: {
        create: await Promise.all((infobox.types || []).map(async (typeName: string, index: number) => {
          const type = await prisma.type.findUnique({ where: { name: typeName.toLowerCase() } });
          return {
            typeId: type?.id || 1,
            slot: index + 1
          };
        }))
      },
      // Stats
      stats: {
        create: Object.entries(stats).map(([statName, baseValue]: [string, any]) => ({
          statName,
          baseValue,
          effort: 0
        }))
      }
    }
  });
}
