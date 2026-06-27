import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  try {
    const { idOrSlug } = await params;
    const isId = /^\d+$/.test(idOrSlug);

    const pokemon = await prisma.pokemon.findFirst({
      where: isId ? { nationalDex: parseInt(idOrSlug) } : { slug: idOrSlug.toLowerCase() },
      include: { flavorTexts: { orderBy: { gameVersion: "asc" } } },
    });

    if (!pokemon) {
      return NextResponse.json({ error: "Pokémon not found" }, { status: 404 });
    }

    return NextResponse.json({ data: pokemon.flavorTexts });
  } catch (err) {
    console.error("Failed to fetch flavor texts:", err);
    return NextResponse.json({ error: "Failed to fetch flavor texts" }, { status: 500 });
  }
}
