import Pokedex from 'pokedex-promise-v2';
import prisma from './prisma';

const P = new Pokedex({
  cacheLimit: 120 * 1000, // 2 minutes in-memory caching
  timeout: 10 * 1000 // 10s timeout
});

// In-memory cache of the full pokemons list to enable fast searches
let pokemonNameListCache: any[] = [];
let isCachingList = false;

/**
 * Pre-cache the full list of Pokémon names from PokéAPI for fast search engine lookup.
 */
export async function ensurePokemonListCached() {
  if (pokemonNameListCache.length > 0 || isCachingList) return;
  isCachingList = true;
  try {
    console.log("▸ Caching full Pokémon name list from PokéAPI via pokedex-promise-v2...");
    const response = await P.getPokemonsList({ limit: 1500, offset: 0 });
    if (response && response.results) {
      pokemonNameListCache = response.results.map((p: any) => {
        const id = parseInt(p.url.split('/').filter(Boolean).pop() || "0");
        return {
          id,
          name: p.name,
          slug: p.name
        };
      });
      console.log(`✓ Cached ${pokemonNameListCache.length} Pokémon names from PokéAPI.`);
    }
  } catch (error) {
    console.error("Failed to cache Pokémon name list:", error);
  } finally {
    isCachingList = false;
  }
}

/**
 * Searches the PokeAPI names list using fuzzy/contains matching.
 */
export async function searchPokeAPI(query: string): Promise<any[]> {
  await ensurePokemonListCached();
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return [];

  // Filter matching names from cache
  const matches = pokemonNameListCache.filter(p => 
    p.name.includes(cleanQuery) || String(p.id) === cleanQuery
  );

  return matches;
}

/**
 * Fetches a Pokémon's full data from PokéAPI and saves/upserts it to the local PostgreSQL database.
 */
export async function fetchAndSavePokemon(idOrSlug: string | number): Promise<any> {
  const identifier = typeof idOrSlug === 'string' ? idOrSlug.toLowerCase().trim() : idOrSlug;
  
  console.log(`▸ Dynamic Fetching Pokémon "${identifier}" from PokéAPI...`);
  
  const [poke, species] = await Promise.all([
    P.getPokemonByName(identifier),
    P.getPokemonSpeciesByName(identifier)
  ]);

  if (!poke || !species) {
    throw new Error(`Pokémon "${identifier}" not found in PokéAPI`);
  }

  // Parse basic details
  const genNum = parseInt(species.generation.url.split("/").filter(Boolean).pop() || "1");
  const genus = species.genera.find((g: any) => g.language.name === "en")?.genus ?? "";
  const nameJapanese = species.names.find((n: any) => n.language.name === "ja-Hrkt" || n.language.name === "ja")?.name || null;
  const description = species.flavor_text_entries.find((e: any) => e.language.name === "en")?.flavor_text.replace(/[\f\n]/g, " ").trim() || "";

  // Make sure the Generation exists in the DB
  const generation = await prisma.generation.findUnique({
    where: { number: genNum }
  });
  if (!generation) {
    // Upsert a default placeholder generation if it doesn't exist
    await prisma.generation.upsert({
      where: { number: genNum },
      update: {},
      create: {
        id: genNum,
        number: genNum,
        name: `Generation ${genNum}`,
        region: "Unknown",
        games: [],
        releaseYear: new Date().getFullYear(),
        pokemonCount: 100,
        newMechanics: []
      }
    });
  }

  // Use a transaction to create the main Pokemon and its basic related fields
  const pokemon = await prisma.pokemon.upsert({
    where: { id: poke.id },
    update: {
      nationalDex: poke.id,
      slug: poke.name,
      name: poke.name.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      nameJapanese,
      genus,
      height: poke.height / 10,
      weight: poke.weight / 10,
      catchRate: species.capture_rate,
      baseFriendship: species.base_happiness,
      baseExp: poke.base_experience,
      growthRate: species.growth_rate.name,
      isLegendary: species.is_legendary,
      isMythical: species.is_mythical,
      isBaby: species.is_baby,
      description
    },
    create: {
      id: poke.id,
      nationalDex: poke.id,
      slug: poke.name,
      name: poke.name.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      nameJapanese,
      genus,
      generationId: genNum,
      height: poke.height / 10,
      weight: poke.weight / 10,
      catchRate: species.capture_rate,
      baseFriendship: species.base_happiness,
      baseExp: poke.base_experience,
      growthRate: species.growth_rate.name,
      isLegendary: species.is_legendary,
      isMythical: species.is_mythical,
      isBaby: species.is_baby,
      description
    }
  });

  // 1. Types
  await prisma.pokemonType.deleteMany({ where: { pokemonId: poke.id } });
  for (const t of poke.types) {
    const typeName = t.type.name.toLowerCase();
    const type = await prisma.type.upsert({
      where: { name: typeName },
      update: {},
      create: {
        name: typeName,
        nameDisplay: typeName.toUpperCase(),
        strongAgainst: [],
        weakAgainst: [],
        immuneTo: []
      }
    });

    await prisma.pokemonType.upsert({
      where: { pokemonId_typeId: { pokemonId: poke.id, typeId: type.id } },
      update: {},
      create: { pokemonId: poke.id, typeId: type.id, slot: t.slot }
    });
  }

  // 2. Stats
  await prisma.pokemonStat.deleteMany({ where: { pokemonId: poke.id } });
  await prisma.pokemonStat.createMany({
    data: poke.stats.map((s: any) => ({
      pokemonId: poke.id,
      statName: s.stat.name,
      baseValue: s.base_stat,
      effort: s.effort
    }))
  });

  // 3. Sprites
  const artwork = poke.sprites?.other?.["official-artwork"];
  if (artwork?.front_default) {
    await prisma.pokemonSprite.upsert({
      where: { id: poke.id * 100 + 1 },
      update: { url: artwork.front_default },
      create: { id: poke.id * 100 + 1, pokemonId: poke.id, label: "official-artwork", url: artwork.front_default, isShiny: false }
    });
  }
  if (artwork?.front_shiny) {
    await prisma.pokemonSprite.upsert({
      where: { id: poke.id * 100 + 2 },
      update: { url: artwork.front_shiny },
      create: { id: poke.id * 100 + 2, pokemonId: poke.id, label: "official-artwork-shiny", url: artwork.front_shiny, isShiny: true }
    });
  }

  // 4. Flavor Texts
  await prisma.flavorText.deleteMany({ where: { pokemonId: poke.id } });
  const seen = new Set<string>();
  const englishFlavorTexts = species.flavor_text_entries.filter((e: any) => e.language.name === "en");
  for (const entry of englishFlavorTexts) {
    if (seen.has(entry.version.name)) continue;
    seen.add(entry.version.name);
    try {
      await prisma.flavorText.create({
        data: {
          pokemonId: poke.id,
          gameVersion: entry.version.name,
          text: entry.flavor_text.replace(/[\f\n]/g, " ").trim(),
          language: "en"
        }
      });
    } catch {}
  }

  // 5. Abilities
  for (const ab of poke.abilities) {
    const abSlug = ab.ability.name.toLowerCase();
    let ability = await prisma.ability.findUnique({ where: { name: abSlug } });
    if (!ability) {
      let desc = "No description available.";
      try {
        const abDetail = await P.getAbilityByName(abSlug);
        desc = abDetail.effect_entries.find((e: any) => e.language.name === 'en')?.effect || 
               abDetail.flavor_text_entries.find((e: any) => e.language.name === 'en')?.flavor_text || 
               desc;
      } catch (e) {
        console.error(`Failed to fetch details for ability: ${abSlug}`);
      }

      ability = await prisma.ability.create({
        data: {
          name: abSlug,
          nameDisplay: ab.ability.name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          description: desc
        }
      });
    }

    await prisma.pokemonAbility.upsert({
      where: { pokemonId_abilityId: { pokemonId: poke.id, abilityId: ability.id } },
      update: { slot: ab.slot, isHidden: ab.is_hidden },
      create: { pokemonId: poke.id, abilityId: ability.id, slot: ab.slot, isHidden: ab.is_hidden }
    });
  }

  // 6. Moves
  await prisma.pokemonMove.deleteMany({ where: { pokemonId: poke.id } });
  const slicedMoves = poke.moves.slice(0, 50); // limit to 50 moves to prevent excessive writes
  for (const m of slicedMoves) {
    const moveSlug = m.move.name.toLowerCase();
    const moveId = parseInt(m.move.url.split('/').filter(Boolean).pop() || "0");
    if (!moveId) continue;

    let dbMove = await prisma.move.findUnique({ where: { name: moveSlug } });
    if (!dbMove) {
      dbMove = await prisma.move.create({
        data: {
          id: moveId,
          name: moveSlug,
          nameDisplay: m.move.name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          category: "physical"
        }
      });
    }

    const detail = m.version_group_details[0];
    const level = detail?.level_learned_at || 0;
    const learnMethod = detail?.move_learn_method?.name || "level-up";
    const gameVersion = detail?.version_group?.name || "red-blue";

    await prisma.pokemonMove.create({
      data: {
        pokemonId: poke.id,
        moveId: dbMove.id,
        learnMethod,
        level,
        gameVersion
      }
    }).catch(() => {});
  }

  // 7. Evolution Chain
  if (species.evolution_chain?.url) {
    const chainId = parseInt(species.evolution_chain.url.split('/').filter(Boolean).pop() || "0");
    if (chainId) {
      let dbChain = await prisma.evolutionChain.findUnique({ where: { id: chainId } });
      if (!dbChain) {
        try {
          const chainData = await P.getEvolutionChainById(chainId);
          dbChain = await prisma.evolutionChain.create({
            data: {
              id: chainId,
              chainData: chainData as any
            }
          });
        } catch (e) {
          console.error(`Failed to fetch evolution chain: ${chainId}`);
        }
      }

      if (dbChain) {
        await prisma.pokemon.update({
          where: { id: poke.id },
          data: { evolutionChainId: dbChain.id }
        });
      }
    }
  }

  // 8. Search Index
  await prisma.searchIndex.upsert({
    where: { id: poke.id },
    update: {},
    create: {
      id: poke.id,
      entityType: "pokemon",
      entityId: poke.id,
      slug: poke.name,
      displayName: pokemon.name,
      keywords: `${poke.name} ${poke.id} ${genus}`.toLowerCase()
    }
  });

  // Re-fetch the saved pokemon with all relations to match server responses
  return await prisma.pokemon.findFirst({
    where: { id: poke.id },
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
    }
  });
}
