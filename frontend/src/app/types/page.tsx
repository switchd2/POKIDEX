import Link from "next/link";

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

export default function TypesPage() {
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
            href={`/types/${type.name}`}
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

      <section className="mt-32">
        <div className="glass p-12 rounded-[48px] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[100px]"></div>
           <h3 className="text-3xl font-premium font-black uppercase italic mb-8">Type Matchup Guide</h3>
           <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-white/50 text-sm leading-relaxed">
                  Understanding type effectiveness is the key to Pokémon mastery. 
                  Each type has distinct strengths and weaknesses against others. 
                  For example, <span className="text-red-500 font-bold uppercase">Fire</span> is super effective against <span className="text-green-500 font-bold uppercase">Grass</span>, 
                  but weak against <span className="text-blue-500 font-bold uppercase">Water</span>.
                </p>
                <div className="flex gap-4">
                   <div className="px-6 py-3 glass rounded-xl text-[10px] uppercase tracking-widest font-black">2.0x Damage</div>
                   <div className="px-6 py-3 glass rounded-xl text-[10px] uppercase tracking-widest font-black text-white/30">0.5x Damage</div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                 <div className="w-full h-48 glass rounded-2xl flex items-center justify-center text-white/10 uppercase tracking-[0.5em] font-black italic">
                    Matchup Table Pro
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
