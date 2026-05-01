import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const POKEAPI_BASE = "https://pokeapi.co/api/v2"

// Helper: fetch with retry
async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
}

// Helper: delay
const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

async function seedGenerations() {
  console.log("Seeding generations...")
  const generations = [
    { id: 1, number: 1, name: "Generation I",   region: "Kanto",   games: ["Red","Blue","Yellow"],             releaseYear: 1996, pokemonCount: 151, newMechanics: ["Pokemon","Gym Badges","Elite Four"] },
    { id: 2, number: 2, name: "Generation II",  region: "Johto",   games: ["Gold","Silver","Crystal"],          releaseYear: 1999, pokemonCount: 100, newMechanics: ["Day/Night","Breeding","Steel/Dark types"] },
    { id: 3, number: 3, name: "Generation III", region: "Hoenn",   games: ["Ruby","Sapphire","Emerald"],        releaseYear: 2002, pokemonCount: 135, newMechanics: ["Abilities","Natures","Double Battles"] },
    { id: 4, number: 4, name: "Generation IV",  region: "Sinnoh",  games: ["Diamond","Pearl","Platinum"],       releaseYear: 2006, pokemonCount: 107, newMechanics: ["Physical/Special split","Online Trading"] },
    { id: 5, number: 5, name: "Generation V",   region: "Unova",   games: ["Black","White","Black2","White2"],  releaseYear: 2010, pokemonCount: 156, newMechanics: ["Triple Battles","Rotation Battles"] },
    { id: 6, number: 6, name: "Generation VI",  region: "Kalos",   games: ["X","Y","OmegaRuby","AlphaSapphire"],releaseYear: 2013, pokemonCount: 72,  newMechanics: ["Mega Evolution","Fairy type","3D graphics"] },
    { id: 7, number: 7, name: "Generation VII", region: "Alola",   games: ["Sun","Moon","UltraSun","UltraMoon"],releaseYear: 2016, pokemonCount: 88,  newMechanics: ["Z-Moves","Regional Forms","Island Trials"] },
    { id: 8, number: 8, name: "Generation VIII",region: "Galar",   games: ["Sword","Shield"],                   releaseYear: 2019, pokemonCount: 96,  newMechanics: ["Dynamax","Wild Area","Max Raids"] },
    { id: 9, number: 9, name: "Generation IX",  region: "Paldea",  games: ["Scarlet","Violet"],                 releaseYear: 2022, pokemonCount: 120, newMechanics: ["Open World","Terastallize","Co-op"] },
  ]

  for (const gen of generations) {
    await prisma.generation.upsert({
      where: { id: gen.id },
      update: gen,
      create: gen,
    })
  }
  console.log("✓ Generations seeded")
}

async function seedTypes() {
  console.log("Seeding types...")
  const types = [
    { id: 1,  name: "normal",   nameDisplay: "NORMAL" },
    { id: 2,  name: "fire",     nameDisplay: "FIRE" },
    { id: 3,  name: "water",    nameDisplay: "WATER" },
    { id: 4,  name: "electric", nameDisplay: "ELECTRIC" },
    { id: 5,  name: "grass",    nameDisplay: "GRASS" },
    { id: 6,  name: "ice",      nameDisplay: "ICE" },
    { id: 7,  name: "fighting", nameDisplay: "FIGHTING" },
    { id: 8,  name: "poison",   nameDisplay: "POISON" },
    { id: 9,  name: "ground",   nameDisplay: "GROUND" },
    { id: 10, name: "flying",   nameDisplay: "FLYING" },
    { id: 11, name: "psychic",  nameDisplay: "PSYCHIC" },
    { id: 12, name: "bug",      nameDisplay: "BUG" },
    { id: 13, name: "rock",     nameDisplay: "ROCK" },
    { id: 14, name: "ghost",    nameDisplay: "GHOST" },
    { id: 15, name: "dragon",   nameDisplay: "DRAGON" },
    { id: 16, name: "dark",     nameDisplay: "DARK" },
    { id: 17, name: "steel",    nameDisplay: "STEEL" },
    { id: 18, name: "fairy",    nameDisplay: "FAIRY" },
  ]
  for (const type of types) {
    await prisma.type.upsert({
      where: { id: type.id },
      update: type,
      create: { ...type, strongAgainst: [], weakAgainst: [], immuneTo: [] },
    })
  }
  console.log("✓ Types seeded")
}

async function seedPokemon(startId: number, endId: number) {
  console.log(`Seeding Pokémon #${startId}–#${endId}...`)

  for (let id = startId; id <= endId; id++) {
    try {
      // Fetch from PokéAPI
      const [pokemon, species] = await Promise.all([
        fetchWithRetry(`${POKEAPI_BASE}/pokemon/${id}`),
        fetchWithRetry(`${POKEAPI_BASE}/pokemon-species/${id}`)
      ])

      // Determine generation from species
      const genNumber = parseInt(
        species.generation.url.split("/").filter(Boolean).pop()
      )

      // Get English flavor text
      const flavorEntries = species.flavor_text_entries
        .filter((e: any) => e.language.name === "en")

      // Get English genus
      const genus = species.genera
        .find((g: any) => g.language.name === "en")?.genus || ""

      // Upsert the Pokémon
      await prisma.pokemon.upsert({
        where: { id: pokemon.id },
        update: {},
        create: {
          id:             pokemon.id,
          nationalDex:    pokemon.id,
          slug:           pokemon.name,
          name:           pokemon.name.charAt(0).toUpperCase() +
                          pokemon.name.slice(1),
          genus:          genus,
          generationId:   genNumber,
          height:         pokemon.height / 10,   // decimetres → metres
          weight:         pokemon.weight / 10,   // hectograms → kg
          catchRate:      species.capture_rate,
          baseFriendship: species.base_happiness,
          baseExp:        pokemon.base_experience,
          growthRate:     species.growth_rate.name,
          isLegendary:    species.is_legendary,
          isMythical:     species.is_mythical,
          isBaby:         species.is_baby,
        },
      })

      // Upsert types
      for (const t of pokemon.types) {
        const typeName = t.type.name
        const typeRecord = await prisma.type.findFirst({
          where: { name: typeName }
        })
        if (typeRecord) {
          await prisma.pokemonType.upsert({
            where: {
              pokemonId_typeId: {
                pokemonId: pokemon.id,
                typeId: typeRecord.id
              }
            },
            update: {},
            create: {
              pokemonId: pokemon.id,
              typeId:    typeRecord.id,
              slot:      t.slot,
            },
          })
        }
      }

      // Upsert stats
      for (const s of pokemon.stats) {
        const statName = s.stat.name  // hp, attack, defense, etc.
        await prisma.pokemonStat.upsert({
          where: {
            id: pokemon.id * 10 + pokemon.stats.indexOf(s)
          },
          update: {},
          create: {
            id:        pokemon.id * 10 + pokemon.stats.indexOf(s),
            pokemonId: pokemon.id,
            statName:  statName,
            baseValue: s.base_stat,
            effort:    s.effort,
          },
        })
      }

      // Upsert sprites
      const officialArtwork =
        pokemon.sprites?.other?.["official-artwork"]?.front_default
      const shinyArtwork =
        pokemon.sprites?.other?.["official-artwork"]?.front_shiny

      if (officialArtwork) {
        await prisma.pokemonSprite.upsert({
          where: { id: pokemon.id * 100 + 1 },
          update: {},
          create: {
            id:        pokemon.id * 100 + 1,
            pokemonId: pokemon.id,
            label:     "official-artwork",
            url:       officialArtwork,
            isShiny:   false,
          },
        })
      }
      if (shinyArtwork) {
        await prisma.pokemonSprite.upsert({
          where: { id: pokemon.id * 100 + 2 },
          update: {},
          create: {
            id:        pokemon.id * 100 + 2,
            pokemonId: pokemon.id,
            label:     "official-artwork-shiny",
            url:       shinyArtwork,
            isShiny:   true,
          },
        })
      }

      // Upsert flavor texts (English only, first 3 games)
      const seen = new Set<string>()
      for (const entry of flavorEntries.slice(0, 6)) {
        const version = entry.version.name
        if (seen.has(version)) continue
        seen.add(version)
        await prisma.flavorText.create({
          data: {
            pokemonId:   pokemon.id,
            gameVersion: version,
            text:        entry.flavor_text.replace(/\f|\n/g, " "),
            language:    "en",
          },
        }).catch(() => {})  // ignore duplicates
      }

      // Update search index
      await prisma.searchIndex.upsert({
        where: { id: pokemon.id },
        update: {},
        create: {
          id:          pokemon.id,
          entityType:  "pokemon",
          entityId:    pokemon.id,
          slug:        pokemon.name,
          displayName: pokemon.name.charAt(0).toUpperCase() +
                       pokemon.name.slice(1),
          keywords:    `${pokemon.name} ${pokemon.id} ${genus}`,
        },
      })

      console.log(
        `  ✓ #${String(id).padStart(4,"0")} ${pokemon.name}`
      )

      // Polite delay — don't hammer PokéAPI
      await delay(300)

    } catch (err) {
      console.error(`  ✗ Failed #${id}:`, err)
      // Continue with next Pokémon
    }
  }
}

async function main() {
  console.log("═══════════════════════════════════════")
  console.log("  PokéWiki Database Seed Starting...")
  console.log("═══════════════════════════════════════")

  await seedGenerations()
  await seedTypes()

  // Seed all 1025 Pokémon
  // Split into batches so you can restart if interrupted
  await seedPokemon(1, 151)    // Gen I   (Kanto)
  await seedPokemon(152, 251)  // Gen II  (Johto)
  await seedPokemon(252, 386)  // Gen III (Hoenn)
  await seedPokemon(387, 493)  // Gen IV  (Sinnoh)
  await seedPokemon(494, 649)  // Gen V   (Unova)
  await seedPokemon(650, 721)  // Gen VI  (Kalos)
  await seedPokemon(722, 809)  // Gen VII (Alola)
  await seedPokemon(810, 905)  // Gen VIII(Galar)
  await seedPokemon(906, 1025) // Gen IX  (Paldea)

  console.log("═══════════════════════════════════════")
  console.log("  ✓ Seed complete!")
  console.log("═══════════════════════════════════════")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
