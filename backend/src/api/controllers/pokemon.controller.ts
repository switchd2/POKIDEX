import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

export const getAllPokemon = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, generation, type, search, sort, legendary, mythical } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};
    if (generation) where.generationId = Number(generation);
    if (type) {
      where.types = {
        some: {
          type: {
            name: String(type).toLowerCase()
          }
        }
      };
    }
    if (search) {
      where.name = {
        contains: String(search),
        mode: 'insensitive'
      };
    }
    if (legendary) where.isLegendary = legendary === 'true';
    if (mythical) where.isMythical = mythical === 'true';

    const orderBy: any = {};
    if (sort === 'number') orderBy.nationalDex = 'asc';
    else if (sort === 'name') orderBy.name = 'asc';
    else orderBy.nationalDex = 'asc';

    const [pokemon, total] = await Promise.all([
      prisma.pokemon.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          types: {
            include: {
              type: true
            }
          },
          sprites: true
        }
      }),
      prisma.pokemon.count({ where })
    ]);

    res.json({
      success: true,
      data: pokemon,
      total,
      page: Number(page),
      pages: Math.ceil(total / take)
    });
  } catch (error) {
    logger.error('Error fetching pokemon:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DB_CONNECTION_ERROR',
        message: 'Could not connect to database. Is postgres running?'
      }
    });
  }
};

export const getPokemonBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const pokemon = await prisma.pokemon.findUnique({
      where: { slug },
      include: {
        types: { include: { type: true } },
        abilities: { include: { ability: true } },
        stats: true,
        moves: { include: { move: true } },
        sprites: true,
        flavorTexts: true,
        locations: true,
        forms: true,
        evolutionChain: true,
        competitiveSets: true,
        mediaAppearances: true,
        eggGroups: { include: { eggGroup: true } }
      }
    });

    if (!pokemon) {
      return res.status(404).json({ success: false, error: { code: 'POKEMON_NOT_FOUND', message: 'Pokemon not found' } });
    }

    res.json({ success: true, data: pokemon });
  } catch (error) {
    logger.error('Error fetching pokemon by slug:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};

export const getNextPrevPokemon = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    
    const [prev, next] = await Promise.all([
      prisma.pokemon.findFirst({
        where: { id: { lt: id } },
        orderBy: { id: 'desc' },
        select: { id: true, nationalDex: true, slug: true, name: true }
      }),
      prisma.pokemon.findFirst({
        where: { id: { gt: id } },
        orderBy: { id: 'asc' },
        select: { id: true, nationalDex: true, slug: true, name: true }
      })
    ]);

    res.json({ success: true, data: { prev, next } });
  } catch (error) {
    logger.error('Error fetching next/prev pokemon:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
};
