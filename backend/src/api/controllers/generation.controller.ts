import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

export const getAllGenerations = async (req: Request, res: Response) => {
  try {
    const gens = await prisma.generation.findMany({
      orderBy: { number: 'asc' }
    });
    res.json({ success: true, data: gens });
  } catch (error) {
    logger.error('Error fetching generations:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};

export const getGenerationByNumber = async (req: Request, res: Response) => {
  try {
    const number = parseInt(req.params.number, 10);
    const gen = await prisma.generation.findUnique({
      where: { number },
      include: {
        pokemon: {
          select: { id: true, slug: true, name: true, nationalDex: true },
          orderBy: { nationalDex: 'asc' }
        }
      }
    });

    if (!gen) {
      return res.status(404).json({ success: false, error: { message: 'Generation not found' } });
    }

    res.json({ success: true, data: gen });
  } catch (error) {
    logger.error('Error fetching generation:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};
