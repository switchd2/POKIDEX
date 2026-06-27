import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { fetchAndSavePokemon } from "@/lib/pokeapi.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;
    const isId = /^\d+$/.test(idOrSlug);

    let pokemon = await prisma.pokemon.findFirst({
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
    });

    if (!pokemon) {
      try {
        pokemon = await fetchAndSavePokemon(idOrSlug);
      } catch (e) {
        console.error(`Dynamic seeding failed for ${idOrSlug}:`, e);
      }
    }

    if (!pokemon) {
      return NextResponse.json({ error: "Pokémon not found" }, { status: 404 });
    }

    return NextResponse.json({ data: pokemon });
  } catch (err) {
    console.error("Failed to fetch pokemon by id/slug:", err);
    return NextResponse.json({ error: "Failed to fetch Pokémon" }, { status: 500 });
  }
}
