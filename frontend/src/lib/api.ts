const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000/api";

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
  const query = new URLSearchParams(params as any).toString();
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
  
  // Flatten results into a single array of SearchItem
  const results: any[] = [];
  
  if (json.data.pokemon) {
    json.data.pokemon.forEach((p: any) => {
      results.push({ name: p.name, id: p.nationalDex, type: 'pokemon', slug: p.slug });
    });
  }
  
  if (json.data.moves) {
    json.data.moves.forEach((m: any) => {
      results.push({ name: m.nameDisplay, id: m.id, type: 'move' });
    });
  }
  
  if (json.data.abilities) {
    json.data.abilities.forEach((a: any) => {
      results.push({ name: a.nameDisplay, id: a.id, type: 'ability' });
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
