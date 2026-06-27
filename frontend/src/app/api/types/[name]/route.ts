import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name: rawName } = await params;
    const name = rawName.toLowerCase();
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
    });

    if (!type) {
      return NextResponse.json({ error: "Type not found" }, { status: 404 });
    }

    return NextResponse.json({ data: type });
  } catch (err) {
    console.error("Failed to fetch type details:", err);
    return NextResponse.json({ error: "Failed to fetch type" }, { status: 500 });
  }
}
