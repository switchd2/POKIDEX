// pokemon.service.ts
// NOTE: The Bulbapedia scraper pipeline was removed.
// upsertPokemon() has been removed as it was dead code (not used by server.ts).
// Data seeding now goes through pokeapi.service.ts (fetchAndSavePokemon).

export interface RawPokemonData {
  infobox: {
    nationalDex: number;
    nameJapanese?: string | null;
    genus?: string | null;
    height?: number | null;
    weight?: number | null;
    catchRate?: number | null;
    baseFriendship?: number | null;
    baseExp?: number | null;
    growthRate?: string | null;
    genderRatio?: string | null;
    hatchTime?: string | null;
    generation?: number | null;
    types?: string[];
  };
  biology: { description?: string | null };
  origin: { designOrigin?: string | null; nameEtymology?: string | null };
  stats: Record<string, number>;
  evolution: unknown;
  learnset: unknown;
}
