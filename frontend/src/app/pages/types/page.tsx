import Link from "next/link";
import TypeDistributionWheel from "@/components/TypeDistributionWheel";
import TypeMatchupMatrix from "@/components/TypeMatchupMatrix";

const POKEMON_TYPES = [
  { name: "normal", color: "#A8A77A" },
  { name: "fire", color: "#EE8130" },
  { name: "water", color: "#6390F0" },
  { name: "electric", color: "#F7D02C" },
  { name: "grass", color: "#7AC74C" },
  { name: "ice", color: "#96D9D6" },
  { name: "fighting", color: "#C22E28" },
  { name: "poison", color: "#A33EA1" },
  { name: "ground", color: "#E2BF65" },
  { name: "flying", color: "#A98FF3" },
  { name: "psychic", color: "#F95587" },
  { name: "bug", color: "#A6B91A" },
  { name: "rock", color: "#B6A136" },
  { name: "ghost", color: "#735797" },
  { name: "dragon", color: "#6F35FC" },
  { name: "dark", color: "#705746" },
  { name: "steel", color: "#B7B7CE" },
  { name: "fairy", color: "#D685AD" },
];

async function getTypesData() {
  const typeData = await Promise.all(
    POKEMON_TYPES.map(async (type) => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${type.name}`, {
          next: { revalidate: 86400 }
        });
        if (!res.ok) return null;
        const data = await res.json();
        
        const pokemon = data.pokemon.map((p: any) => {
          const id = parseInt(p.pokemon.url.split('/').filter(Boolean).pop() || '0');
          return {
            id,
            name: p.pokemon.name,
            url: p.pokemon.url
          };
        }).filter((p: any) => p.id > 0 && p.id <= 1025);

        return {
          name: type.name,
          count: pokemon.length,
          pokemon
        };
      } catch (e) {
        return null;
      }
    })
  );
  
  return typeData.filter(Boolean) as any[];
}

export default async function TypesPage() {
  const typeData = await getTypesData();

  return (
    <div className="container-wide py-24 animate-fade">
      <div className="mb-16">
        <h1 className="text-xs uppercase tracking-[0.6em] font-black text-red-500 mb-4">Core Elements</h1>
        <h2 className="text-6xl font-premium font-black uppercase italic tracking-tighter">Elemental Types</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {POKEMON_TYPES.map((type) => (
          <Link 
            key={type.name} 
            href={`/pages/types/${type.name}`}
            className="glass p-6 rounded-2xl glass-hover text-center group relative overflow-hidden"
          >
            <div 
              className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" 
              style={{ backgroundColor: type.color }}
            ></div>
            <div 
              className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
              style={{ backgroundColor: type.color }}
            >
               <span className="text-white font-black text-lg">{type.name.charAt(0).toUpperCase()}</span>
            </div>
            <h3 className="text-xs font-premium font-black uppercase tracking-[0.2em]">{type.name}</h3>
          </Link>
        ))}
      </div>

      {/* Type Matchup Matrix */}
      <section className="mt-32">
        <div className="glass p-8 md:p-12 rounded-[48px] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[100px]"></div>
           <div className="relative z-10">
             <h3 className="text-3xl font-premium font-black uppercase italic mb-6">Type Matchup Guide</h3>
             <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mb-10">
               Understanding type effectiveness is the key to Pokémon mastery. 
               Each type has distinct strengths and weaknesses against others. 
               Select attacking and defending types to see multipliers.
             </p>
             <TypeMatchupMatrix />
           </div>
        </div>
      </section>

      {/* Type Distribution Wheel */}
      <section className="mt-32">
        <div className="glass p-8 md:p-12 rounded-[48px] relative overflow-hidden">
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 blur-[100px]"></div>
           <div className="relative z-10">
             <h3 className="text-3xl font-premium font-black uppercase italic mb-6">Type Distribution</h3>
             <p className="text-slate-500 text-sm leading-relaxed max-w-3xl mb-10">
               Explore how many Pokémon exist for each elemental type across Generations 1-9.
             </p>
             <TypeDistributionWheel typeData={typeData} />
           </div>
        </div>
      </section>
    </div>
  );
}
