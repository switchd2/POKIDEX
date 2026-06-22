import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { searchPokeAPI, fetchAndSavePokemon } from "@/lib/pokeapi.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ data: [], meta: { total: 0 } });
    }

    // 1. Query local database search index first
    let results = await prisma.searchIndex.findMany({
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
    });

    // 2. Query PokeAPI names for matches using pokedex-promise-v2
    const pokeApiMatches = await searchPokeAPI(q);
    
    // Filter matches that are NOT already in our database search index
    const existingIds = new Set(results.map(r => r.id));
    const missingMatches = pokeApiMatches.filter(m => !existingIds.has(m.id)).slice(0, 5); // limit to top 5 to keep response times fast

    if (missingMatches.length > 0) {
      console.log(`▸ Dynamically seeding ${missingMatches.length} missing search matches from PokeAPI:`, missingMatches.map(m => m.name));
      // Fetch and save them in the background / parallel
      await Promise.all(
        missingMatches.map(m => fetchAndSavePokemon(m.name).catch(err => {
          console.error(`Failed to dynamically seed search item ${m.name}:`, err);
        }))
      );

      // 3. Re-run local search query to get the newly seeded Pokemon
      results = await prisma.searchIndex.findMany({
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
      });
    }

    return NextResponse.json({ data: results, meta: { total: results.length, query: q } });
  } catch (err) {
    console.error("Search failed:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
