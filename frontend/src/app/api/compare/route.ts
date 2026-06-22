import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids") || "";
    
    const ids = idsParam
      .split(",")
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id))
      .slice(0, 6); // max 6 at a time

    if (ids.length === 0) {
      return NextResponse.json({ error: "Provide ids query param, e.g. ?ids=1,4,7" }, { status: 400 });
    }

    const pokemon = await prisma.pokemon.findMany({
      where: { nationalDex: { in: ids } },
      include: {
        stats:   true,
        types:   { include: { type: true } },
        sprites: { where: { label: "official-artwork" } },
      },
      orderBy: { nationalDex: "asc" },
    });

    return NextResponse.json({ data: pokemon });
  } catch (err) {
    console.error("Comparison failed:", err);
    return NextResponse.json({ error: "Comparison failed" }, { status: 500 });
  }
}
