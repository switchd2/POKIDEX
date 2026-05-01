import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client"

dotenv.config()
const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// ──────────────────────────────────────────────────────────
// HEALTH CHECK
// ──────────────────────────────────────────────────────────

// GET /health
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// ──────────────────────────────────────────────────────────
// POKÉMON ROUTES
// ──────────────────────────────────────────────────────────

// GET /api/pokemon
// Query params: page, limit, generation, type, legendary, mythical
// Example: GET /api/pokemon?page=1&limit=20&generation=1&type=fire
app.get("/api/pokemon", async (req: Request, res: Response) => {
  try {
    const page       = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit      = Math.min(100, parseInt(req.query.limit as string) || 20)
    const skip       = (page - 1) * limit
    const generation = req.query.generation ? parseInt(req.query.generation as string) : undefined
    const typeName   = req.query.type as string | undefined
    const legendary  = req.query.legendary === "true"  ? true  : req.query.legendary === "false" ? false : undefined
    const mythical   = req.query.mythical  === "true"  ? true  : req.query.mythical  === "false" ? false : undefined

    const where: any = {}
    if (generation) where.generationId = generation
    if (legendary !== undefined) where.isLegendary = legendary
    if (mythical  !== undefined) where.isMythical  = mythical
    if (typeName) {
      where.types = { some: { type: { name: typeName.toLowerCase() } } }
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
    ])

    res.json({
      data: pokemon,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Pokémon" })
  }
})

// GET /api/pokemon/:idOrSlug
// Accepts national dex number OR slug name
// Example: GET /api/pokemon/25  OR  GET /api/pokemon/pikachu
app.get("/api/pokemon/:idOrSlug", async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params as { idOrSlug: string }
    const isId = /^\d+$/.test(idOrSlug)

    const pokemon = await prisma.pokemon.findFirst({
      where: isId ? { nationalDex: parseInt(idOrSlug) } : { slug: idOrSlug.toLowerCase() },
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
    })

    if (!pokemon) return res.status(404).json({ error: "Pokémon not found" })
    res.json({ data: pokemon })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Pokémon" })
  }
})

// GET /api/pokemon/:idOrSlug/stats
// Returns base stats for a Pokémon
app.get("/api/pokemon/:idOrSlug/stats", async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params as { idOrSlug: string }
    const isId = /^\d+$/.test(idOrSlug)

    const pokemon = await prisma.pokemon.findFirst({
      where: isId ? { nationalDex: parseInt(idOrSlug) } : { slug: idOrSlug.toLowerCase() },
      include: { stats: true },
    })

    if (!pokemon) return res.status(404).json({ error: "Pokémon not found" })

    const total = pokemon.stats.reduce((sum, s) => sum + s.baseValue, 0)
    res.json({ data: { pokemonId: pokemon.id, name: pokemon.name, stats: pokemon.stats, total } })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" })
  }
})

// GET /api/pokemon/:idOrSlug/moves
// Returns all moves a Pokémon can learn
app.get("/api/pokemon/:idOrSlug/moves", async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params as { idOrSlug: string }
    const isId = /^\d+$/.test(idOrSlug)
    const method = req.query.method as string | undefined

    const pokemon = await prisma.pokemon.findFirst({
      where: isId ? { nationalDex: parseInt(idOrSlug) } : { slug: idOrSlug.toLowerCase() },
    })
    if (!pokemon) return res.status(404).json({ error: "Pokémon not found" })

    const moves = await prisma.pokemonMove.findMany({
      where: {
        pokemonId:   pokemon.id,
        ...(method ? { learnMethod: method } : {}),
      },
      include: { move: { include: { type: true } } },
      orderBy: [{ learnMethod: "asc" }, { level: "asc" }],
    })

    res.json({ data: moves })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch moves" })
  }
})

// GET /api/pokemon/:idOrSlug/flavor-texts
// Returns Pokédex flavor text entries
app.get("/api/pokemon/:idOrSlug/flavor-texts", async (req: Request, res: Response) => {
  try {
    const { idOrSlug } = req.params as { idOrSlug: string }
    const isId = /^\d+$/.test(idOrSlug)

    const pokemon = await prisma.pokemon.findFirst({
      where: isId ? { nationalDex: parseInt(idOrSlug) } : { slug: idOrSlug.toLowerCase() },
      include: { flavorTexts: { orderBy: { gameVersion: "asc" } } },
    })

    if (!pokemon) return res.status(404).json({ error: "Pokémon not found" })
    res.json({ data: pokemon.flavorTexts })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch flavor texts" })
  }
})

// ──────────────────────────────────────────────────────────
// GENERATION ROUTES
// ──────────────────────────────────────────────────────────

// GET /api/generations
// Returns all generations
app.get("/api/generations", async (_req: Request, res: Response) => {
  try {
    const generations = await prisma.generation.findMany({
      orderBy: { number: "asc" },
      include: { _count: { select: { pokemon: true } } },
    })
    res.json({ data: generations })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch generations" })
  }
})

// GET /api/generations/:number
// Example: GET /api/generations/1  → returns Kanto info + all its Pokémon
app.get("/api/generations/:number", async (req: Request, res: Response) => {
  try {
    const genNumber = parseInt(req.params.number as string)
    const includePokemon = req.query.pokemon !== "false"

    const generation = await prisma.generation.findUnique({
      where: { number: genNumber },
      include: includePokemon
        ? {
            pokemon: {
              orderBy: { nationalDex: "asc" },
              include: {
                types:   { include: { type: true } },
                sprites: { where: { label: "official-artwork" } },
              },
            },
          }
        : undefined,
    })

    if (!generation) return res.status(404).json({ error: "Generation not found" })
    res.json({ data: generation })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch generation" })
  }
})

// ──────────────────────────────────────────────────────────
// TYPE ROUTES
// ──────────────────────────────────────────────────────────

// GET /api/types
// Returns all 18 types with matchup data
app.get("/api/types", async (_req: Request, res: Response) => {
  try {
    const types = await prisma.type.findMany({
      orderBy: { id: "asc" },
      include: { _count: { select: { pokemon: true, moves: true } } },
    })
    res.json({ data: types })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch types" })
  }
})

// GET /api/types/:name
// Example: GET /api/types/fire
app.get("/api/types/:name", async (req: Request, res: Response) => {
  try {
    const name = (req.params.name as string).toLowerCase()
    const type = await prisma.type.findUnique({
      where: { name },
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
    })

    if (!type) return res.status(404).json({ error: "Type not found" })
    res.json({ data: type })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch type" })
  }
})

// ──────────────────────────────────────────────────────────
// SEARCH ROUTE
// ──────────────────────────────────────────────────────────

// GET /api/search?q=pikachu
// Full text search across Pokémon names, dex numbers, genus
app.get("/api/search", async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || "").toLowerCase().trim()
    if (!q || q.length < 2) {
      return res.json({ data: [], meta: { total: 0 } })
    }

    const results = await prisma.searchIndex.findMany({
      where: {
        OR: [
          { keywords:    { contains: q } },
          { displayName: { contains: q, mode: "insensitive" } },
          { slug:        { contains: q } },
        ],
      },
      take: 20,
      include: {
        pokemon: {
          include: {
            types:   { include: { type: true } },
            sprites: { where: { label: "official-artwork" } },
          },
        },
      },
    })

    res.json({ data: results, meta: { total: results.length, query: q } })
  } catch (err) {
    res.status(500).json({ error: "Search failed" })
  }
})

// ──────────────────────────────────────────────────────────
// STATS COMPARISON ROUTE
// ──────────────────────────────────────────────────────────

// GET /api/compare?ids=1,4,7
// Compare base stats of multiple Pokémon side by side
app.get("/api/compare", async (req: Request, res: Response) => {
  try {
    const ids = (req.query.ids as string || "")
      .split(",")
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id))
      .slice(0, 6)  // max 6 at a time

    if (ids.length === 0) return res.status(400).json({ error: "Provide ids query param, e.g. ?ids=1,4,7" })

    const pokemon = await prisma.pokemon.findMany({
      where:   { nationalDex: { in: ids } },
      include: {
        stats:   true,
        types:   { include: { type: true } },
        sprites: { where: { label: "official-artwork" } },
      },
      orderBy: { nationalDex: "asc" },
    })

    res.json({ data: pokemon })
  } catch (err) {
    res.status(500).json({ error: "Comparison failed" })
  }
})

// ──────────────────────────────────────────────────────────
// LEGENDARY / MYTHICAL ROUTES
// ──────────────────────────────────────────────────────────

// GET /api/legendaries
app.get("/api/legendaries", async (_req: Request, res: Response) => {
  try {
    const pokemon = await prisma.pokemon.findMany({
      where:   { isLegendary: true },
      orderBy: { nationalDex: "asc" },
      include: {
        types:      { include: { type: true } },
        sprites:    { where: { label: "official-artwork" } },
        generation: { select: { number: true, name: true, region: true } },
      },
    })
    res.json({ data: pokemon, meta: { total: pokemon.length } })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch legendaries" })
  }
})

// GET /api/mythicals
app.get("/api/mythicals", async (_req: Request, res: Response) => {
  try {
    const pokemon = await prisma.pokemon.findMany({
      where:   { isMythical: true },
      orderBy: { nationalDex: "asc" },
      include: {
        types:      { include: { type: true } },
        sprites:    { where: { label: "official-artwork" } },
        generation: { select: { number: true, name: true, region: true } },
      },
    })
    res.json({ data: pokemon, meta: { total: pokemon.length } })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch mythicals" })
  }
})

// ──────────────────────────────────────────────────────────
// 404 FALLBACK
// ──────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" })
})

// ──────────────────────────────────────────────────────────
// START SERVER
// ──────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`\n🚀 PokéWiki API running at http://localhost:${PORT}`)
  console.log("\nAvailable endpoints:")
  console.log("  GET /health")
  console.log("  GET /api/pokemon               ?page, ?limit, ?generation, ?type, ?legendary, ?mythical")
  console.log("  GET /api/pokemon/:idOrSlug")
  console.log("  GET /api/pokemon/:idOrSlug/stats")
  console.log("  GET /api/pokemon/:idOrSlug/moves     ?method")
  console.log("  GET /api/pokemon/:idOrSlug/flavor-texts")
  console.log("  GET /api/generations")
  console.log("  GET /api/generations/:number         ?pokemon=false")
  console.log("  GET /api/types")
  console.log("  GET /api/types/:name")
  console.log("  GET /api/search                ?q=")
  console.log("  GET /api/compare               ?ids=1,4,7")
  console.log("  GET /api/legendaries")
  console.log("  GET /api/mythicals\n")
})

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`)
  } else {
    console.error('❌ Server error:', err)
  }
  process.exit(1)
})
