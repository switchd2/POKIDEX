import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page       = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
    const limit      = Math.min(100, parseInt(searchParams.get("limit") || "20") || 20);
    const skip       = (page - 1) * limit;
    const generation = searchParams.get("generation") ? parseInt(searchParams.get("generation") || "") : undefined;
    const typeName   = searchParams.get("type") || undefined;
    
    const legendaryParam = searchParams.get("legendary");
    const legendary  = legendaryParam === "true" ? true : legendaryParam === "false" ? false : undefined;
    
    const mythicalParam = searchParams.get("mythical");
    const mythical   = mythicalParam === "true" ? true : mythicalParam === "false" ? false : undefined;

    const where: any = {};
    if (generation) where.generationId = generation;
    if (legendary !== undefined) where.isLegendary = legendary;
    if (mythical !== undefined) where.isMythical = mythical;
    if (typeName) {
      where.types = { some: { type: { name: typeName.toLowerCase() } } };
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
    ]);

    return NextResponse.json({
      data: pokemon,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("Failed to fetch pokemon:", err);
    return NextResponse.json({ error: "Failed to fetch Pokémon" }, { status: 500 });
  }
}
