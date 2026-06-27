import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ number: string }> }
) {
  try {
    const { number } = await params;
    const genNumber = parseInt(number);
    const { searchParams } = new URL(request.url);
    const includePokemon = searchParams.get("pokemon") !== "false";

    if (isNaN(genNumber)) {
      return NextResponse.json({ error: "Invalid generation number" }, { status: 400 });
    }

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
    });

    if (!generation) {
      return NextResponse.json({ error: "Generation not found" }, { status: 404 });
    }

    return NextResponse.json({ data: generation });
  } catch (err) {
    console.error("Failed to fetch generation details:", err);
    return NextResponse.json({ error: "Failed to fetch generation" }, { status: 500 });
  }
}
