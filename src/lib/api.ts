const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export async function getPokemon(slug: string) {
  const res = await fetch(`${API_BASE}/pokemon/${slug}`, {
    next: { revalidate: 86400 }
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
    next: { revalidate: 3600 }
  });
  if (!res.ok) throw new Error("Failed to fetch Pokémon list");
  const json = await res.json();
  return json;
}

export async function searchPokemon(q: string) {
  const res = await fetch(`${API_BASE}/search?q=${q}`);
  if (!res.ok) throw new Error("Search failed");
  const json = await res.json();
  return json.data;
}

export async function getType(name: string) {
  const res = await fetch(`${API_BASE}/types/${name}`);
  if (!res.ok) throw new Error("Type not found");
  const json = await res.json();
  return json.data;
}

export async function getMove(name: string) {
  const res = await fetch(`${API_BASE}/moves/${name}`);
  if (!res.ok) throw new Error("Move not found");
  const json = await res.json();
  return json.data;
}

export async function getAbility(name: string) {
  const res = await fetch(`${API_BASE}/abilities/${name}`);
  if (!res.ok) throw new Error("Ability not found");
  const json = await res.json();
  return json.data;
}

export async function getGenerations() {
  const res = await fetch(`${API_BASE}/generations`);
  if (!res.ok) throw new Error("Failed to fetch generations");
  const json = await res.json();
  return json.data;
}
