import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

export const search = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: { pokemon: [], moves: [], abilities: [] } });

    const query = String(q);

    const [pokemon, moves, abilities] = await Promise.all([
      prisma.pokemon.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { slug: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 10,
        select: { id: true, slug: true, name: true, nationalDex: true }
      }),
      prisma.move.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        take: 10,
        select: { id: true, name: true, nameDisplay: true }
      }),
      prisma.ability.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        take: 10,
        select: { id: true, name: true, nameDisplay: true }
      })
    ]);

    res.json({
      success: true,
      data: { pokemon, moves, abilities }
    });
  } catch (error) {
    logger.error('Search error:', error);
    res.status(500).json({ success: false, error: { message: 'Search failed' } });
  }
};
