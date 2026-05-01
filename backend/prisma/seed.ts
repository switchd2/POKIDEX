import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const POKEAPI = "https://pokeapi.co/api/v2"
const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

async function fetchJSON(url: string): Promise<any> {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
      return await res.json()
    } catch (e) {
      if (i === 2) throw e
      await delay(1000 * (i + 1))
    }
  }
}

async function seedGenerations() {
  console.log("\n▸ Seeding generations...")
  const gens = [
    { id:1, number:1, name:"Generation I",    region:"Kanto",  games:["Red","Blue","Yellow"],               releaseYear:1996, pokemonCount:151, newMechanics:["Pokémon","Badges","Elite Four"] },
    { id:2, number:2, name:"Generation II",   region:"Johto",  games:["Gold","Silver","Crystal"],           releaseYear:1999, pokemonCount:100, newMechanics:["Day/Night cycle","Breeding","Steel type","Dark type"] },
    { id:3, number:3, name:"Generation III",  region:"Hoenn",  games:["Ruby","Sapphire","Emerald"],         releaseYear:2002, pokemonCount:135, newMechanics:["Abilities","Natures","Double Battles","Contests"] },
    { id:4, number:4, name:"Generation IV",   region:"Sinnoh", games:["Diamond","Pearl","Platinum"],        releaseYear:2006, pokemonCount:107, newMechanics:["Physical/Special split","Online play","Underground"] },
    { id:5, number:5, name:"Generation V",    region:"Unova",  games:["Black","White","Black 2","White 2"], releaseYear:2010, pokemonCount:156, newMechanics:["Triple Battles","Rotation Battles","Seasons"] },
    { id:6, number:6, name:"Generation VI",   region:"Kalos",  games:["X","Y","Omega Ruby","Alpha Sapphire"],releaseYear:2013, pokemonCount:72,  newMechanics:["Mega Evolution","Fairy type","Full 3D graphics"] },
    { id:7, number:7, name:"Generation VII",  region:"Alola",  games:["Sun","Moon","Ultra Sun","Ultra Moon"],releaseYear:2016, pokemonCount:88,  newMechanics:["Z-Moves","Regional Forms","Island Trials"] },
    { id:8, number:8, name:"Generation VIII", region:"Galar",  games:["Sword","Shield"],                    releaseYear:2019, pokemonCount:96,  newMechanics:["Dynamax","Gigantamax","Wild Area","Max Raids"] },
    { id:9, number:9, name:"Generation IX",   region:"Paldea", games:["Scarlet","Violet"],                  releaseYear:2022, pokemonCount:120, newMechanics:["Open World","Terastallize","Co-op exploration"] },
  ]
  for (const g of gens) {
    await prisma.generation.upsert({ where:{id:g.id}, update:g, create:g })
  }
  console.log("  ✓ 9 generations seeded")
}

async function seedTypes() {
  console.log("\n▸ Seeding types...")
  const types = [
    { id:1,  name:"normal",   nameDisplay:"NORMAL",   strongAgainst:[], weakAgainst:["rock","steel"], immuneTo:["ghost"] },
    { id:2,  name:"fire",     nameDisplay:"FIRE",     strongAgainst:["grass","ice","bug","steel"], weakAgainst:["fire","water","rock","dragon"], immuneTo:[] },
    { id:3,  name:"water",    nameDisplay:"WATER",    strongAgainst:["fire","ground","rock"], weakAgainst:["water","grass","dragon"], immuneTo:[] },
    { id:4,  name:"electric", nameDisplay:"ELECTRIC", strongAgainst:["water","flying"], weakAgainst:["electric","grass","dragon"], immuneTo:["ground"] },
    { id:5,  name:"grass",    nameDisplay:"GRASS",    strongAgainst:["water","ground","rock"], weakAgainst:["fire","grass","poison","flying","bug","dragon","steel"], immuneTo:[] },
    { id:6,  name:"ice",      nameDisplay:"ICE",      strongAgainst:["grass","ground","flying","dragon"], weakAgainst:["steel","fire","water","ice"], immuneTo:[] },
    { id:7,  name:"fighting", nameDisplay:"FIGHTING", strongAgainst:["normal","ice","rock","dark","steel"], weakAgainst:["poison","flying","psychic","bug","fairy"], immuneTo:["ghost"] },
    { id:8,  name:"poison",   nameDisplay:"POISON",   strongAgainst:["grass","fairy"], weakAgainst:["poison","ground","rock","ghost"], immuneTo:["steel"] },
    { id:9,  name:"ground",   nameDisplay:"GROUND",   strongAgainst:["fire","electric","poison","rock","steel"], weakAgainst:["grass","bug"], immuneTo:["flying"] },
    { id:10, name:"flying",   nameDisplay:"FLYING",   strongAgainst:["grass","fighting","bug"], weakAgainst:["electric","rock","steel"], immuneTo:["ground"] },
    { id:11, name:"psychic",  nameDisplay:"PSYCHIC",  strongAgainst:["fighting","poison"], weakAgainst:["psychic","steel"], immuneTo:["dark"] },
    { id:12, name:"bug",      nameDisplay:"BUG",      strongAgainst:["grass","psychic","dark"], weakAgainst:["fire","fighting","flying","ghost","steel","fairy"], immuneTo:[] },
    { id:13, name:"rock",     nameDisplay:"ROCK",     strongAgainst:["fire","ice","flying","bug"], weakAgainst:["fighting","ground","steel"], immuneTo:[] },
    { id:14, name:"ghost",    nameDisplay:"GHOST",    strongAgainst:["psychic","ghost"], weakAgainst:["dark"], immuneTo:["normal","fighting"] },
    { id:15, name:"dragon",   nameDisplay:"DRAGON",   strongAgainst:["dragon"], weakAgainst:["steel"], immuneTo:["fairy"] },
    { id:16, name:"dark",     nameDisplay:"DARK",     strongAgainst:["psychic","ghost"], weakAgainst:["fighting","dark","fairy"], immuneTo:["psychic"] },
    { id:17, name:"steel",    nameDisplay:"STEEL",    strongAgainst:["ice","rock","fairy"], weakAgainst:["steel","fire","water","electric"], immuneTo:["poison"] },
    { id:18, name:"fairy",    nameDisplay:"FAIRY",    strongAgainst:["fighting","dragon","dark"], weakAgainst:["poison","steel"], immuneTo:["dragon"] },
  ]
  for (const t of types) {
    await prisma.type.upsert({ where:{id:t.id}, update:t, create:t })
  }
  console.log("  ✓ 18 types seeded")
}

async function seedPokemon(startId: number, endId: number) {
  console.log(`\n▸ Seeding Pokémon #${startId}–#${endId}...`)
  let success = 0, failed = 0

  for (let id = startId; id <= endId; id++) {
    try {
      const [poke, species] = await Promise.all([
        fetchJSON(`${POKEAPI}/pokemon/${id}`),
        fetchJSON(`${POKEAPI}/pokemon-species/${id}`)
      ])

      const genNum = parseInt(
        species.generation.url.split("/").filter(Boolean).pop()
      )
      const genus = species.genera
        .find((g: any) => g.language.name === "en")?.genus ?? ""

      await prisma.pokemon.upsert({
        where: { id: poke.id },
        update: {},
        create: {
          id:             poke.id,
          nationalDex:    poke.id,
          slug:           poke.name,
          name:           poke.name
                            .split("-")
                            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" "),
          genus,
          generationId:   genNum,
          height:         poke.height / 10,
          weight:         poke.weight / 10,
          catchRate:      species.capture_rate,
          baseFriendship: species.base_happiness,
          baseExp:        poke.base_experience,
          growthRate:     species.growth_rate.name,
          isLegendary:    species.is_legendary,
          isMythical:     species.is_mythical,
          isBaby:         species.is_baby,
        },
      })

      for (const t of poke.types) {
        const dbType = await prisma.type.findFirst({ where: { name: t.type.name } })
        if (dbType) {
          await prisma.pokemonType.upsert({
            where: { pokemonId_typeId: { pokemonId: poke.id, typeId: dbType.id } },
            update: {},
            create: { pokemonId: poke.id, typeId: dbType.id, slot: t.slot },
          })
        }
      }

      await prisma.pokemonStat.deleteMany({ where: { pokemonId: poke.id } })
      await prisma.pokemonStat.createMany({
        data: poke.stats.map((s: any) => ({
          pokemonId: poke.id,
          statName:  s.stat.name,
          baseValue: s.base_stat,
          effort:    s.effort,
        })),
      })

      const artwork = poke.sprites?.other?.["official-artwork"]
      if (artwork?.front_default) {
        await prisma.pokemonSprite.upsert({
          where: { id: poke.id * 100 + 1 },
          update: {},
          create: { id: poke.id * 100 + 1, pokemonId: poke.id, label: "official-artwork", url: artwork.front_default, isShiny: false },
        })
      }
      if (artwork?.front_shiny) {
        await prisma.pokemonSprite.upsert({
          where: { id: poke.id * 100 + 2 },
          update: {},
          create: { id: poke.id * 100 + 2, pokemonId: poke.id, label: "official-artwork-shiny", url: artwork.front_shiny, isShiny: true },
        })
      }

      const seen = new Set<string>()
      for (const entry of species.flavor_text_entries.filter((e: any) => e.language.name === "en")) {
        if (seen.has(entry.version.name)) continue
        seen.add(entry.version.name)
        try {
          await prisma.flavorText.create({
            data: { pokemonId: poke.id, gameVersion: entry.version.name, text: entry.flavor_text.replace(/[\f\n]/g, " ").trim(), language: "en" },
          })
        } catch {}
      }

      await prisma.searchIndex.upsert({
        where: { id: poke.id },
        update: {},
        create: {
          id:          poke.id,
          entityType:  "pokemon",
          entityId:    poke.id,
          slug:        poke.name,
          displayName: poke.name.charAt(0).toUpperCase() + poke.name.slice(1),
          keywords:    `${poke.name} ${poke.id} ${genus}`.toLowerCase(),
        },
      })

      success++
      process.stdout.write(
        `\r  Progress: ${id}/${endId} | ✓ ${success} seeded | ✗ ${failed} failed`
      )
      await delay(250)
    } catch (err: any) {
      failed++
      console.error(`\n  ✗ Failed #${id}: ${err.message}`)
    }
  }
  console.log(`\n  Done: ${success} seeded, ${failed} failed`)
}

async function main() {
  console.log("═══════════════════════════════════════════════")
  console.log("        PokéWiki — Database Seed")
  console.log("═══════════════════════════════════════════════")
  console.log("This will take approximately 15–20 minutes.")
  console.log("Do not close this window.\n")

  await seedGenerations()
  await seedTypes()
  await seedPokemon(1,   151)
  await seedPokemon(152, 251)
  await seedPokemon(252, 386)
  await seedPokemon(387, 493)
  await seedPokemon(494, 649)
  await seedPokemon(650, 721)
  await seedPokemon(722, 809)
  await seedPokemon(810, 905)
  await seedPokemon(906, 1025)

  console.log("\n═══════════════════════════════════════════════")
  console.log("  ✓ All 1,025 Pokémon seeded successfully!")
  console.log("  Open Prisma Studio: npx prisma studio")
  console.log("═══════════════════════════════════════════════")
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
