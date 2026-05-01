import Link from "next/link";
import { getPokemonList } from "@/lib/api";

export default async function TypePage({
  params,
  searchParams,
}: {
  params: { type: string };
  searchParams: { page?: string };
}) {
  const type = params.type;
  const page = parseInt(searchParams.page || "1");

  let data: any = { data: [], meta: { total: 0, totalPages: 0 } };
  try {
    data = await getPokemonList({ 
      page, 
      limit: 20, 
      type: type
    });
  } catch (e) {
    console.error("Failed to fetch typed pokedex data");
  }

  const pokemon = data.data;

  // Let's create a visual mapping for the types
  const TYPE_COLORS: Record<string, string> = {
    normal: "#A8A77A", fire: "#EE8130", water: "#6390F0",
    electric: "#F7D02C", grass: "#7AC74C", ice: "#96D9D6",
    fighting: "#C22E28", poison: "#A33EA1", ground: "#E2BF65",
    flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
    rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC",
    dark: "#705746", steel: "#B7B7CE", fairy: "#D685AD"
  };

  const typeColor = TYPE_COLORS[type.toLowerCase()] || "#FFFFFF";

  return (
    <div className="container-wide py-24 animate-fade">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 relative">
        <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] pointer-events-none" style={{ backgroundColor: `${typeColor}30` }}></div>
        <div className="relative z-10">
          <Link href="/types" className="text-xs uppercase tracking-widest text-[var(--text-muted)] hover:text-white mb-4 block inline-flex items-center gap-2">
            ← Back to Types
          </Link>
          <div className="flex items-center gap-4 mb-2">
             <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.3)]" style={{ backgroundColor: typeColor }}>
                <span className="text-white font-black text-lg">{type.charAt(0).toUpperCase()}</span>
             </div>
             <h1 className="text-xs uppercase tracking-[0.6em] font-black" style={{ color: typeColor }}>{type} Type</h1>
          </div>
          <h2 className="text-6xl font-premium font-black uppercase italic tracking-tighter">
            {type} Pokémon
          </h2>
        </div>
        
        <div className="flex gap-4 relative z-10">
          <div className="glass px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white/40">
            {data.meta.total} Pokémon
          </div>
        </div>
      </div>

      <div className="grid-poke">
        {pokemon.map((p: any) => (
          <Link 
            key={p.slug} 
            href={`/pokemon/${p.slug}`}
            className="poke-card glass glass-hover relative overflow-hidden group"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: typeColor }}></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <span className="mono text-xs font-bold text-white/30">#{String(p.nationalDex).padStart(4, '0')}</span>
              <div className="flex gap-1">
                {p.types?.map((t: any) => (
                  <span key={t.type.name} className="type-badge" style={t.type.name === type ? { backgroundColor: typeColor, borderColor: typeColor } : {}}>{t.type.name}</span>
                ))}
              </div>
            </div>
            <div className="aspect-square mb-8 relative z-10">
              <img 
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.nationalDex}.png`} 
                alt={p.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
              />
            </div>
            <h4 className="text-2xl font-premium font-black uppercase italic mb-2 relative z-10">{p.name}</h4>
            <div className="flex justify-between items-center relative z-10">
                <span className="text-[10px] uppercase tracking-widest text-white/30">{p.generation?.region || "Unknown"} Region</span>
                <div className="h-1 w-8 rounded-full" style={{ backgroundColor: typeColor }}></div>
            </div>
          </Link>
        ))}
        {pokemon.length === 0 && (
          <div className="col-span-full text-center py-24 glass rounded-3xl">
             <h3 className="text-2xl font-premium font-black uppercase italic text-white/30">No Pokémon found for this type</h3>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data.meta.totalPages > 1 && (
        <div className="flex justify-center mt-24 gap-4">
          {page > 1 && (
            <Link 
              href={`/types/${type}?page=${page - 1}`}
              className="px-8 py-4 glass rounded-2xl font-premium font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
            >
              Previous
            </Link>
          )}
          <div className="px-8 py-4 glass rounded-2xl font-premium font-black text-xs">
            Page {page} of {data.meta.totalPages}
          </div>
          {page < data.meta.totalPages && (
            <Link 
              href={`/types/${type}?page=${page + 1}`}
              className="px-8 py-4 rounded-2xl font-premium font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg"
              style={{ backgroundColor: typeColor }}
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
