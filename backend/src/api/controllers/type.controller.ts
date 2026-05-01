import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

export const getAllTypes = async (req: Request, res: Response) => {
  try {
    const types = await prisma.type.findMany();
    res.json({ success: true, data: types });
  } catch (error) {
    logger.error('Error fetching types:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};

export const getTypeByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const type = await prisma.type.findUnique({
      where: { name: name.toLowerCase() },
      include: {
        pokemon: {
          include: {
            pokemon: {
              select: { id: true, slug: true, name: true, nationalDex: true }
            }
          }
        }
      }
    });

    if (!type) {
      return res.status(404).json({ success: false, error: { message: 'Type not found' } });
    }

    res.json({ success: true, data: type });
  } catch (error) {
    logger.error('Error fetching type:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};
