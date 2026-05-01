import Link from "next/link";
import { getPokemonList } from "@/lib/api";

export default async function PokedexPage({
  searchParams,
}: {
  searchParams: { page?: string; type?: string; generation?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const type = searchParams.type;
  const gen = searchParams.generation;

  let data: any = { data: [], meta: { total: 0, totalPages: 0 } };
  try {
    data = await getPokemonList({ 
      page, 
      limit: 20, 
      type, 
      generation: gen ? parseInt(gen) : undefined 
    });
  } catch (e) {
    console.error("Failed to fetch pokedex data");
  }

  const pokemon = data.data;

  return (
    <div className="container-wide py-24 animate-fade">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
        <div>
          <h1 className="text-xs uppercase tracking-[0.6em] font-black text-red-500 mb-4">Database</h1>
          <h2 className="text-6xl font-premium font-black uppercase italic tracking-tighter">National Pokédex</h2>
        </div>
        
        <div className="flex gap-4">
          {/* Simple Filters (Mockup for now) */}
          <div className="glass px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white/40">
            Filters Coming Soon
          </div>
        </div>
      </div>

      <div className="grid-poke">
        {pokemon.map((p: any, i: number) => (
          <Link 
            key={p.slug} 
            href={`/pokemon/${p.slug}`}
            className="poke-card glass glass-hover"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="mono text-xs font-bold text-white/30">#{String(p.nationalDex).padStart(4, '0')}</span>
              <div className="flex gap-1">
                {p.types?.map((t: any) => (
                  <span key={t.type.name} className="type-badge">{t.type.name}</span>
                ))}
              </div>
            </div>
            <div className="aspect-square mb-8">
              <img 
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/${p.nationalDex}.png`} 
                alt={p.name}
                className="w-full h-full object-contain"
              />
            </div>
            <h4 className="text-2xl font-premium font-black uppercase italic mb-2">{p.name}</h4>
            <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-white/30">{p.generation?.region || "Kanto"} Region</span>
                <div className="h-1 w-8 grad-poke rounded-full"></div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-24 gap-4">
        {page > 1 && (
          <Link 
            href={`/pokedex?page=${page - 1}${type ? `&type=${type}` : ""}${gen ? `&generation=${gen}` : ""}`}
            className="px-8 py-4 glass rounded-2xl font-premium font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
          >
            Previous
          </Link>
        )}
        <div className="px-8 py-4 glass rounded-2xl font-premium font-black text-xs">
          Page {page} of {data.meta.totalPages || 1}
        </div>
        {page < data.meta.totalPages && (
          <Link 
            href={`/pokedex?page=${page + 1}${type ? `&type=${type}` : ""}${gen ? `&generation=${gen}` : ""}`}
            className="px-8 py-4 grad-poke rounded-2xl font-premium font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
