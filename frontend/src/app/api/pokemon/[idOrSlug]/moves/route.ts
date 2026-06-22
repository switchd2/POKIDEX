import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { idOrSlug: string } }
) {
  try {
    const { idOrSlug } = params;
    const { searchParams } = new URL(request.url);
    const method = searchParams.get("method") || undefined;
    const isId = /^\d+$/.test(idOrSlug);

    const pokemon = await prisma.pokemon.findFirst({
      where: isId ? { nationalDex: parseInt(idOrSlug) } : { slug: idOrSlug.toLowerCase() },
    });
    
    if (!pokemon) {
      return NextResponse.json({ error: "Pokémon not found" }, { status: 404 });
    }

    const moves = await prisma.pokemonMove.findMany({
      where: {
        pokemonId: pokemon.id,
        ...(method ? { learnMethod: method } : {}),
      },
      include: { move: { include: { type: true } } },
      orderBy: [{ learnMethod: "asc" }, { level: "asc" }],
    });

    return NextResponse.json({ data: moves });
  } catch (err) {
    console.error("Failed to fetch pokemon moves:", err);
    return NextResponse.json({ error: "Failed to fetch moves" }, { status: 500 });
  }
}
