import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const types = await prisma.type.findMany({
      orderBy: { id: "asc" },
      include: { _count: { select: { pokemon: true, moves: true } } },
    });
    return NextResponse.json({ data: types });
  } catch (err) {
    console.error("Failed to fetch types:", err);
    return NextResponse.json({ error: "Failed to fetch types" }, { status: 500 });
  }
}
