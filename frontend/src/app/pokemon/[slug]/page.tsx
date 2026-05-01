import Link from "next/link";
import { getPokemon } from "@/lib/api";
import StatBar from "@/components/StatBar";
import FlavorTextList from "@/components/FlavorTextList";
import EvolutionChain from "@/components/EvolutionChain";

export default async function PokemonDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let pokemon: any = null;
  try {
    pokemon = await getPokemon(params.slug);
  } catch (e) {
    return (
      <div className="container-wide py-40 text-center">
        <h1 className="text-4xl font-premium font-black uppercase mb-4">Pokémon Not Found</h1>
        <Link href="/pokedex" className="text-red-500 underline">Back to Pokedex</Link>
      </div>
    );
  }

  const artwork = pokemon.sprites.find((s: any) => s.label === "official-artwork")?.url || 
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/${pokemon.nationalDex}.png`;

  return (
    <div className="animate-fade">
      {/* Detail Header */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/5 blur-[150px] -z-10 rounded-full"></div>
        
        <div className="container-wide grid md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img 
              src={artwork} 
              alt={pokemon.name}
              className="w-full max-w-[500px] mx-auto filter drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-transform duration-700 hover:scale-110"
            />
          </div>

          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="mono text-2xl font-black text-white/20">#{String(pokemon.nationalDex).padStart(4, '0')}</span>
              <div className="h-px flex-1 bg-white/10"></div>
              <div className="flex gap-2">
                {pokemon.types.map((t: any) => (
                  <span key={t.type.name} className="px-4 py-1.5 glass rounded-full text-xs font-black uppercase tracking-widest border border-white/10">
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="text-7xl md:text-8xl font-premium font-black uppercase italic leading-none tracking-tighter mb-4">
              {pokemon.name}
            </h1>
            <p className="text-xl font-medium text-white/40 mb-10 italic uppercase tracking-[0.2em]">
              The {pokemon.genus || "Unknown"} Pokémon
            </p>

            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="glass p-6 rounded-2xl">
                <span className="block text-[10px] uppercase tracking-widest text-white/30 mb-2">Height</span>
                <span className="text-2xl font-premium font-bold">{pokemon.height}m</span>
              </div>
              <div className="glass p-6 rounded-2xl">
                <span className="block text-[10px] uppercase tracking-widest text-white/30 mb-2">Weight</span>
                <span className="text-2xl font-premium font-bold">{pokemon.weight}kg</span>
              </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xs uppercase tracking-[0.4em] font-black text-white/30 mb-4">Base Stats</h3>
                {pokemon.stats.map((s: any) => (
                    <StatBar key={s.statName} label={s.statName} value={s.baseValue} />
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Info Sections */}
      <section className="container-wide py-20">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-20">
            {/* Flavor Text */}
            <div>
               <h3 className="text-xs uppercase tracking-[0.4em] font-black text-red-500 mb-8 underline underline-offset-8">Pokédex Entries</h3>
               <FlavorTextList entries={pokemon.flavorTexts} />
            </div>

            {/* Evolution */}
            <div>
               <h3 className="text-xs uppercase tracking-[0.4em] font-black text-red-500 mb-8 underline underline-offset-8">Evolution Path</h3>
               <EvolutionChain data={pokemon.evolutionChain?.chainData} currentId={pokemon.id} />
            </div>
          </div>

          <div className="space-y-12">
            {/* Abilities */}
            <div className="glass p-8 rounded-[32px]">
               <h3 className="text-xs uppercase tracking-[0.4em] font-black text-white/30 mb-8">Abilities</h3>
               <div className="space-y-6">
                 {pokemon.abilities.map((a: any) => (
                   <div key={a.ability.name}>
                     <span className="block text-sm font-black uppercase tracking-widest mb-1">
                        {a.ability.nameDisplay} {a.isHidden && <span className="text-[10px] text-red-500 ml-2">(Hidden)</span>}
                     </span>
                     <p className="text-xs text-white/40 leading-relaxed">{a.ability.description}</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* Training */}
            <div className="glass p-8 rounded-[32px]">
               <h3 className="text-xs uppercase tracking-[0.4em] font-black text-white/30 mb-8">Training</h3>
               <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-xs text-white/40 uppercase font-bold">Catch Rate</span>
                    <span className="text-sm font-bold">{pokemon.catchRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/40 uppercase font-bold">Base Friendship</span>
                    <span className="text-sm font-bold">{pokemon.baseFriendship}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/40 uppercase font-bold">Growth Rate</span>
                    <span className="text-sm font-bold uppercase">{pokemon.growthRate}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
