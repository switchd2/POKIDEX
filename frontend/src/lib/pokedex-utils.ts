export interface PokemonBase {
  id: number;
  name: string;
  types: string[];
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  artworkUrl: string;
  stats: {
    name: string;
    value: number;
  }[];
  abilities: string[];
}

export function getArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function getGeneration(id: number): number {
  if (id <= 151) return 1;
  if (id <= 251) return 2;
  if (id <= 386) return 3;
  if (id <= 493) return 4;
  if (id <= 649) return 5;
  if (id <= 721) return 6;
  if (id <= 809) return 7;
  if (id <= 905) return 8;
  if (id <= 1025) return 9;
  return 10;
}

export function getGenerationName(gen: number): string {
  switch (gen) {
    case 1: return "Kanto (Gen 1)";
    case 2: return "Johto (Gen 2)";
    case 3: return "Hoenn (Gen 3)";
    case 4: return "Sinnoh (Gen 4)";
    case 5: return "Unova (Gen 5)";
    case 6: return "Kalos (Gen 6)";
    case 7: return "Alola (Gen 7)";
    case 8: return "Galar (Gen 8)";
    case 9: return "Paldea (Gen 9)";
    default: return `Gen ${gen}`;
  }
}
