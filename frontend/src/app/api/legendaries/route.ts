import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pokemon = await prisma.pokemon.findMany({
      where:   { isLegendary: true },
      orderBy: { nationalDex: "asc" },
      include: {
        types:      { include: { type: true } },
        sprites:    { where: { label: "official-artwork" } },
        generation: { select: { number: true, name: true, region: true } },
      },
    });
    return NextResponse.json({ data: pokemon, meta: { total: pokemon.length } });
  } catch (err) {
    console.error("Failed to fetch legendaries:", err);
    return NextResponse.json({ error: "Failed to fetch legendaries" }, { status: 500 });
  }
}
