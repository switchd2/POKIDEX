import prisma from "./prisma";
import { fetchAndSavePokemon } from "./pokeapi.service";

export function getSpriteUrl(url: string | null | undefined, nationalDex?: number): string {
  if (url && url.startsWith('http')) return url;
  const dexId = nationalDex || 0;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexId}.png`;
}

export async function getPokemon(slug: string) {
  const isId = /^\d+$/.test(slug);
  let pokemon = await prisma.pokemon.findFirst({
    where: isId ? { nationalDex: parseInt(slug) } : { slug: slug.toLowerCase() },
    include: {
      types:          { include: { type: true } },
      stats:          true,
      sprites:        true,
      abilities:      { include: { ability: true } },
      flavorTexts:    { orderBy: { gameVersion: "asc" } },
      moves:          { include: { move: { include: { type: true } } }, take: 50 },
      forms:          true,
      locations:      true,
      competitiveSets: true,
      eggGroups:      { include: { eggGroup: true } },
      generation:     true,
      evolutionChain: true,
    },
  });

  if (!pokemon) {
    try {
      pokemon = await fetchAndSavePokemon(slug);
    } catch (e) {
      console.error(`Dynamic seeding failed for ${slug}:`, e);
    }
  }

  if (!pokemon) throw new Error("Pokémon not found");
  return pokemon;
}

export async function getPokemonList(params: {
  page?: number;
  limit?: number;
  generation?: number;
  type?: string;
  legendary?: boolean;
  mythical?: boolean;
}) {
  const page       = Math.max(1, params.page || 1);
  const limit      = Math.min(100, params.limit || 20);
  const skip       = (page - 1) * limit;
  const generation = params.generation;
  const typeName   = params.type;
  const legendary  = params.legendary;
  const mythical   = params.mythical;

  const where: any = {};
  if (generation) where.generationId = generation;
  if (legendary !== undefined) where.isLegendary = legendary;
  if (mythical !== undefined) where.isMythical = mythical;
  if (typeName) {
    where.types = { some: { type: { name: typeName.toLowerCase() } } };
  }

  const [total, pokemon] = await Promise.all([
    prisma.pokemon.count({ where }),
    prisma.pokemon.findMany({
      where,
      skip,
      take: limit,
      orderBy: { nationalDex: "asc" },
      include: {
        types:   { include: { type: true } },
        stats:   true,
        sprites: { where: { label: "official-artwork" } },
        generation: { select: { name: true, region: true } },
      },
    }),
  ]);

  return {
    data: pokemon,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getGenerations() {
  return await prisma.generation.findMany({
    orderBy: { number: "asc" },
    include: { _count: { select: { pokemon: true } } },
  });
}

export async function getType(name: string) {
  const type = await prisma.type.findUnique({
    where: { name: name.toLowerCase() },
    include: {
      pokemon: {
        include: {
          pokemon: {
            include: {
              sprites: { where: { label: "official-artwork" } },
              types:   { include: { type: true } },
            },
          },
        },
      },
      moves: { take: 20 },
    },
  });

  if (!type) throw new Error("Type not found");
  return type;
}
