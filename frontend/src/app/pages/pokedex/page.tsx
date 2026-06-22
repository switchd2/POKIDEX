import PokedexClient from '@/components/PokedexClient';
import { PokemonBase } from '@/lib/pokedex-utils';

export const metadata = {
  title: 'Pokédex — PokéWiki',
  description: 'Browse, filter, and search all 1025 Pokémon from Generations 1 to 9 with base stats and official artwork.',
};

export default async function PokedexPage() {
  try {
    // 1. Fetch the main Pokémon list (names and URLs for all 1025 Pokémon)
    const listRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0', {
      next: { revalidate: 86400 } // cache for 24h
    });
    if (!listRes.ok) throw new Error('Failed to fetch Pokémon list');
    const listData = await listRes.json();

    // 2. Fetch all type data to map Pokémon to their types
    const typesListRes = await fetch('https://pokeapi.co/api/v2/type', {
      next: { revalidate: 86400 }
    });
    if (!typesListRes.ok) throw new Error('Failed to fetch types list');
    const typesListData = await typesListRes.json();
    const typeNames = typesListData.results.map((r: any) => r.name);

    const pokemonNameToTypesMap: Record<string, string[]> = {};

    // Fetch the Pokémon list for each type in parallel
    await Promise.all(
      typeNames.map(async (typeName: string) => {
        try {
          const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`, {
            next: { revalidate: 86400 }
          });
          if (!typeRes.ok) return;
          const typeData = await typeRes.json();
          typeData.pokemon.forEach((entry: any) => {
            const name = entry.pokemon.name;
            if (!pokemonNameToTypesMap[name]) {
              pokemonNameToTypesMap[name] = [];
            }
            pokemonNameToTypesMap[name].push(typeName);
          });
        } catch (e) {
          console.error(`Failed to fetch type mapping for: ${typeName}`, e);
        }
      })
    );

    // 3. Construct the list of Pokémon with their mapped types and IDs
    const pokemonList: PokemonBase[] = listData.results.map((p: any) => {
      const id = parseInt(p.url.split('/').filter(Boolean).pop() || '0');
      return {
        id,
        name: p.name,
        types: pokemonNameToTypesMap[p.name] || [],
      };
    }).filter((p: PokemonBase) => p.id > 0 && p.id <= 1025) // Filter to exact Gen 1-9 count
      .sort((a: PokemonBase, b: PokemonBase) => a.id - b.id); // Sort by National Dex ID

    return <PokedexClient initialList={pokemonList} />;
  } catch (error) {
    console.error('Error loading Pokédex build-time data:', error);
    
    // Minimal fallback in case PokéAPI is down during build
    return (
      <div className="container-wide py-24 text-center">
        <h1 className="text-3xl font-black text-slate-800 uppercase italic">Pokédex Temporarily Offline</h1>
        <p className="text-slate-500 mt-2">Could not retrieve Pokémon database from PokeAPI. Please try again later.</p>
      </div>
    );
  }
}
