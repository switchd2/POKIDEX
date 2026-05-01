import Link from "next/link";
import { getGenerations } from "@/lib/api";

export default async function GenerationsPage() {
  let generations: any[] = [];
  try {
    generations = await getGenerations();
  } catch (e) {
    // Fallback static data
    generations = [
      { number: 1, name: "Generation I", region: "Kanto", releaseYear: 1996, pokemonCount: 151 },
      { number: 2, name: "Generation II", region: "Johto", releaseYear: 1999, pokemonCount: 100 },
      { number: 3, name: "Generation III", region: "Hoenn", releaseYear: 2002, pokemonCount: 135 },
      { number: 4, name: "Generation IV", region: "Sinnoh", releaseYear: 2006, pokemonCount: 107 },
      { number: 5, name: "Generation V", region: "Unova", releaseYear: 2010, pokemonCount: 156 },
      { number: 6, name: "Generation VI", region: "Kalos", releaseYear: 2013, pokemonCount: 72 },
      { number: 7, name: "Generation VII", region: "Alola", releaseYear: 2016, pokemonCount: 88 },
      { number: 8, name: "Generation VIII", region: "Galar", releaseYear: 2019, pokemonCount: 96 },
      { number: 9, name: "Generation IX", region: "Paldea", releaseYear: 2022, pokemonCount: 120 },
    ];
  }

  return (
    <div className="container-wide py-24 animate-fade">
      <div className="mb-16">
        <h1 className="text-xs uppercase tracking-[0.6em] font-black text-red-500 mb-4">Anthology</h1>
        <h2 className="text-6xl font-premium font-black uppercase italic tracking-tighter">Pokémon Eras</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {generations.map((gen) => (
          <Link 
            key={gen.number} 
            href={`/pokedex?generation=${gen.number}`}
            className="glass p-8 rounded-[32px] glass-hover group flex flex-col justify-between h-[300px]"
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="mono text-xs font-black text-white/20">GEN {gen.number}</span>
                <span className="text-[10px] uppercase tracking-widest text-red-500 font-black">{gen.releaseYear}</span>
              </div>
              <h3 className="text-4xl font-premium font-black uppercase italic mb-2 group-hover:text-red-500 transition-colors">
                {gen.region}
              </h3>
              <p className="text-sm text-white/40 font-medium tracking-wide italic">
                {gen.name} · {gen.pokemonCount} New Species
              </p>
            </div>
            
            <div className="flex justify-between items-end">
               <div className="flex -space-x-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center bg-white/5">
                        <img 
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/${gen.number * 10 + i}.png`} 
                          alt="starter" 
                          className="w-8 h-8 object-contain"
                        />
                    </div>
                  ))}
               </div>
               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-red-500 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
               </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
