import Link from "next/link";
import { getPokemonList, getPokemon } from "@/lib/api";

export default async function PokedexLanding() {
  // Fetch Showcase Pokémon (First 8)
  let showcasePokemon = [];
  let featuredPokemon = null;

  try {
    const showcaseData = await getPokemonList({ limit: 8 });
    showcasePokemon = showcaseData.data;
    featuredPokemon = await getPokemon("charizard");
  } catch (e) {
    console.error("Failed to fetch landing page data", e);
  }

  const types = [
    { name: "Fire", color: "#EE8130" },
    { name: "Water", color: "#6390F0" },
    { name: "Grass", color: "#7AC74C" },
    { name: "Electric", color: "#F7D02C" },
    { name: "Psychic", color: "#F95587" },
    { name: "Ice", color: "#96D9D6" },
    { name: "Dragon", color: "#6F35FC" },
    { name: "Dark", color: "#705746" },
  ];

  return (
    <div className="bg-[var(--bg-base)] min-h-screen overflow-x-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-40 px-6 bg-[#F8F9FF] overflow-hidden">
        {/* Floating Sprites (Decorative) */}
        <div className="absolute top-1/4 -left-20 animate-float opacity-20 pointer-events-none hidden lg:block">
           <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/25.png" alt="Pikachu" className="w-64" />
        </div>
        <div className="absolute bottom-10 -right-20 animate-float opacity-20 pointer-events-none hidden lg:block" style={{ animationDelay: '1s' }}>
           <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/150.png" alt="Mewtwo" className="w-80" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="hero-title mb-6">
            POKIDEX
          </h1>
          <p className="text-xl text-[var(--text-secondary)] mb-12 font-medium tracking-tight">
            Your Ultimate Pokémon Encyclopedia — Search. Explore. Discover.
          </p>

          <div className="max-w-2xl mx-auto mb-12 relative group">
             <div className="absolute inset-0 bg-[var(--accent-red)] opacity-5 blur-xl group-focus-within:opacity-10 transition-opacity"></div>
             <div className="relative flex items-center bg-white border border-[var(--border)] rounded-2xl p-2 shadow-sm transition-all focus-within:shadow-md focus-within:border-[var(--accent-red)]">
                <svg className="w-6 h-6 text-[var(--text-muted)] ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input 
                  type="text" 
                  placeholder="Search any Pokémon..." 
                  className="w-full p-4 bg-transparent outline-none text-[var(--text-primary)] font-medium placeholder:text-[var(--text-muted)]"
                />
             </div>
          </div>

          <Link href="/pages/pokedex" className="btn-primary inline-flex items-center gap-2 group">
            Explore All Pokémon
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-32 px-6 bg-white border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🔍" 
              title="Instant Search" 
              desc="Find any of 1000+ Pokémon in milliseconds with our optimized engine."
              accent="#FF3B3B"
            />
            <FeatureCard 
              icon="📊" 
              title="Full Stats" 
              desc="View HP, Attack, Defense, Speed & more in beautiful animated bars."
              accent="#4cc9f0"
            />
            <FeatureCard 
              icon="🔗" 
              title="Evolution Chains" 
              desc="Discover how your Pokémon evolve step by step with clear visual paths."
              accent="#FFD700"
            />
            <FeatureCard 
              icon="🎨" 
              title="Type-Based Theming" 
              desc="Our adaptive UI automatically changes colors to match each Pokémon's primary type."
              accent="#F95587"
            />
            <FeatureCard 
              icon="📱" 
              title="Fully Responsive" 
              desc="Works seamlessly on desktop, tablet, and mobile for the best experience everywhere."
              accent="#6390F0"
            />
            <FeatureCard 
              icon="⚡" 
              title="Powered by PokéAPI" 
              desc="Direct integration with the world's leading Pokémon database for up-to-date data."
              accent="#7AC74C"
            />
          </div>
        </div>
      </section>

      {/* --- SHOWCASE SECTION --- */}
      <section className="py-32 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-extrabold text-[var(--text-primary)] mb-4">Catch &apos;Em All</h2>
          <div className="h-1 w-20 bg-[var(--accent-red)] mx-auto rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {showcasePokemon.map((p: any) => (
            <ShowcaseCard key={p.id} pokemon={p} />
          ))}
        </div>
      </section>

      {/* --- TYPE FILTER PREVIEW --- */}
      <section className="py-24 px-6 bg-white border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-sm uppercase tracking-[0.2em] font-bold text-[var(--text-muted)] mb-8">Filter by Type</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {types.map((t) => (
              <button 
                key={t.name}
                className="px-8 py-3 rounded-full border-2 text-sm font-bold transition-all hover:scale-105"
                style={{ borderColor: t.color, color: t.name === 'Fire' ? '#FFFFFF' : t.color, backgroundColor: t.name === 'Fire' ? t.color : 'transparent' }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS PREVIEW SECTION --- */}
      <section className="py-32 px-6 bg-[#F5F5FA]">
        <div className="max-w-5xl mx-auto">
          {featuredPokemon && (
            <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-[var(--card-shadow)] flex flex-col md:flex-row items-center gap-16">
              <div className="w-full md:w-1/2 flex justify-center">
                <img 
                  src={featuredPokemon.sprites.find((s:any) => s.label === 'official-artwork')?.url} 
                  alt={featuredPokemon.name}
                  className="w-full max-w-sm animate-float"
                />
              </div>
              <div className="w-full md:w-1/2">
                <div className="flex gap-2 mb-6">
                  {featuredPokemon.types.map((t: any) => (
                    <span key={t.type.name} className={`type-badge type-${t.type.name.toLowerCase()}`}>
                      {t.type.name}
                    </span>
                  ))}
                </div>
                <h4 className="text-4xl font-extrabold text-[var(--text-primary)] mb-8 capitalize">{featuredPokemon.name}</h4>
                
                <div className="space-y-6">
                  {featuredPokemon.stats.map((s: any) => (
                    <div key={s.statName}>
                      <div className="flex justify-between text-xs font-bold uppercase mb-2">
                        <span className="text-[var(--text-secondary)]">{s.statName}</span>
                        <span className="text-[var(--text-primary)]">{s.baseValue}</span>
                      </div>
                      <div className="stat-bar-bg">
                        <div 
                          className="stat-bar-fill bg-[var(--accent-red)]" 
                          style={{ width: `${(s.baseValue / 255) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-8 mt-12 pt-12 border-t border-[var(--border)]">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-1">Height</span>
                    <span className="font-bold">{featuredPokemon.height}m</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-1">Weight</span>
                    <span className="font-bold">{featuredPokemon.weight}kg</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white py-16 px-6 border-t-[3px] border-[var(--accent-red)]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
             <Link href="/" className="font-bold text-2xl text-[var(--text-primary)]">
               <span className="text-[var(--accent-red)]">POKI</span>DEX
             </Link>
          </div>
          <p className="text-[var(--text-secondary)] mb-8 font-medium">
            Built with ❤️ using PokéAPI | POKIDEX &copy; 2025
          </p>
          <div className="flex justify-center gap-8 text-sm font-bold text-[var(--text-muted)]">
            <Link href="/" className="hover:text-[var(--accent-red)] transition-colors">Home</Link>
            <Link href="/pages/pokedex" className="hover:text-[var(--accent-red)] transition-colors">Pokémon</Link>
            <Link href="/pages/types" className="hover:text-[var(--accent-red)] transition-colors">Types</Link>
            <Link href="#" className="hover:text-[var(--accent-red)] transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, accent }: { icon: string; title: string; desc: string; accent: string }) {
  return (
    <div 
      className="p-10 rounded-2xl bg-[#f0f0f5] border-l-[6px] shadow-sm hover:shadow-md transition-shadow"
      style={{ borderLeftColor: accent }}
    >
      <div className="text-4xl mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">{title}</h3>
      <p className="text-[var(--text-secondary)] leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function ShowcaseCard({ pokemon }: { pokemon: any }) {
  return (
    <Link href={`/pages/pokemon/${pokemon.slug}`} className="card-poke p-8 group text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-slate-100 rounded-full scale-90 group-hover:scale-100 transition-transform opacity-50"></div>
        <img 
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/${pokemon.nationalDex}.png`} 
          alt={pokemon.name}
          className="w-full relative z-10 transition-transform group-hover:scale-110"
        />
      </div>
      <span className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">#{String(pokemon.nationalDex).padStart(4, '0')}</span>
      <h4 className="text-xl font-bold text-[var(--text-primary)] capitalize mb-3">{pokemon.name}</h4>
      <div className="flex justify-center gap-2">
        {pokemon.types?.map((t: any) => (
          <span key={t.type.name} className={`type-badge type-${t.type.name.toLowerCase()}`}>
            {t.type.name}
          </span>
        ))}
      </div>
    </Link>
  );
}
