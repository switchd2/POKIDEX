import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const generations = await prisma.generation.findMany({
      orderBy: { number: "asc" },
      include: { _count: { select: { pokemon: true } } },
    });
    return NextResponse.json({ data: generations });
  } catch (err) {
    console.error("Failed to fetch generations:", err);
    return NextResponse.json({ error: "Failed to fetch generations" }, { status: 500 });
  }
}
