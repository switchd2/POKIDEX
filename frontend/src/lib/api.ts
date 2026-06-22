export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000/api";
export function getSpriteUrl(url: string | null | undefined, nationalDex?: number): string {
  const defaultUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${nationalDex}.png`;
  return url || defaultUrl;
}

export async function getPokemon(slug: string) {
  const res = await fetch(`${API_BASE}/pokemon/${slug}`, {
    next: { revalidate: 0 }
  });
  if (!res.ok) throw new Error("Pokémon not found");
  const json = await res.json();
  return json.data;
}

export async function getPokemonList(params: {
  page?: number;
  limit?: number;
  generation?: number;
  type?: string;
  sort?: string;
  search?: string;
  legendary?: boolean;
  mythical?: boolean;
}) {
  const cleanParams: any = {};
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null) {
      cleanParams[key] = String(val);
    }
  }
  const query = new URLSearchParams(cleanParams).toString();
  const res = await fetch(`${API_BASE}/pokemon?${query}`, {
    next: { revalidate: 0 }
  });
  if (!res.ok) throw new Error("Failed to fetch Pokémon list");
  const json = await res.json();
  return json;
}

export async function searchPokemon(q: string) {
  const res = await fetch(`${API_BASE}/search?q=${q}`);
  if (!res.ok) throw new Error("Search failed");
  const json = await res.json();
  
  const results: any[] = [];
  
  if (json.data && Array.isArray(json.data)) {
    json.data.forEach((item: any) => {
      if (item.pokemon) {
        results.push({
          id: item.pokemon.id,
          name: item.pokemon.name,
          slug: item.pokemon.slug,
          nationalDex: item.pokemon.nationalDex,
          types: item.pokemon.types?.map((t: any) => t.type.name) || [],
          type: 'pokemon'
        });
      } else {
        results.push({
          id: item.entityId,
          name: item.displayName,
          slug: item.slug,
          type: item.entityType
        });
      }
    });
  }
  
  return results;
}

export async function getType(name: string) {
  const res = await fetch(`${API_BASE}/types/${name}`);
  if (!res.ok) throw new Error("Type not found");
  const json = await res.json();
  return json.data;
}


export async function getGenerations() {
  const res = await fetch(`${API_BASE}/generations`);
  if (!res.ok) throw new Error("Failed to fetch generations");
  const json = await res.json();
  return json.data;
}
