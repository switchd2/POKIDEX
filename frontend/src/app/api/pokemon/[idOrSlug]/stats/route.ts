import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { idOrSlug: string } }
) {
  try {
    const { idOrSlug } = params;
    const isId = /^\d+$/.test(idOrSlug);

    const pokemon = await prisma.pokemon.findFirst({
      where: isId ? { nationalDex: parseInt(idOrSlug) } : { slug: idOrSlug.toLowerCase() },
      include: { stats: true },
    });

    if (!pokemon) {
      return NextResponse.json({ error: "Pokémon not found" }, { status: 404 });
    }

    const total = pokemon.stats.reduce((sum, s) => sum + s.baseValue, 0);
    
    return NextResponse.json({
      data: {
        pokemonId: pokemon.id,
        name: pokemon.name,
        stats: pokemon.stats,
        total,
      },
    });
  } catch (err) {
    console.error("Failed to fetch pokemon stats:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
