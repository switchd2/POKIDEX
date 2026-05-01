import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SectionHeader from "@/components/SectionHeader";
import FeaturedCard from "@/components/FeaturedCard";
import PokemonCard from "@/components/PokemonCard";

async function getFeaturedPokemon(id: number) {
  try {
    const res = await fetch(`http://127.0.0.1:4000/api/pokemon/${id}`, { next: { revalidate: 0 } });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

async function getLatestPokemon() {
  try {
    const res = await fetch(`http://127.0.0.1:4000/api/pokemon?limit=20&page=1`, { next: { revalidate: 0 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data ?? [];
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  // Fetch Hero Featured (Charizard = 6)
  const heroPokemon = await getFeaturedPokemon(6);
  const gridPokemon = await getLatestPokemon();

  return (
    <main className="bg-[var(--bg-base)]">
      {/* HERO SECTION */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden w-full pt-16 pb-24">
        {/* Radial Gradient Background */}
        <div 
          className="absolute inset-0 pointer-events-none -z-10"
          style={{
            background: "radial-gradient(ellipse at 20% 50%, rgba(230, 57, 70, 0.15) 0%, transparent 60%)"
          }}
        />
        
        <div className="max-w-7xl mx-auto w-full px-6 flex flex-col md:flex-row items-center gap-12">
          {/* Left Column (60%) */}
          <div className="w-full md:w-[60%]">
            <h1 className="font-bebas text-8xl md:text-[80px] text-[var(--text-primary)] leading-[1] mb-6 tracking-wide">
              CATCH THE LEGEND
            </h1>
            <p className="font-sans text-lg text-[var(--text-secondary)] max-w-md mb-8">
              Explore the most advanced database of 1,025 Pokémon across 9 generations.
            </p>
            <div className="flex gap-4">
              <Link href="/pokedex" className="bg-[var(--accent-red)] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
                Explore Dex →
              </Link>
              <Link href="/generations" className="border border-[var(--border)] text-[var(--text-secondary)] px-6 py-3 rounded-lg hover:bg-white/5 transition-colors">
                The History
              </Link>
            </div>
          </div>

          {/* Right Column (40%) */}
          <div className="w-full md:w-[40%] flex justify-end">
            {heroPokemon ? (
              <FeaturedCard pokemon={heroPokemon} />
            ) : (
              <div className="w-[320px] h-[380px] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl flex items-center justify-center text-[var(--text-muted)]">
                Featured Pokémon Unavailable
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="relative z-20 -mt-16 mb-24 px-6">
        <SearchBar />
      </section>

      {/* POKEMON GRID CARDS */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <SectionHeader 
          label="Discovery" 
          title="Featured This Week" 
          linkText="View All →" 
          linkHref="/pokedex" 
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {gridPokemon.map((p: any, idx: number) => (
            <PokemonCard key={idx} pokemon={p} />
          ))}
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-[var(--bg-elevated)] border-y border-[var(--border)] py-12 mb-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="font-bebas text-5xl text-[var(--accent-red)] mb-2">1,025</div>
            <div className="font-sans text-sm uppercase tracking-widest text-[var(--text-secondary)]">Total Species</div>
          </div>
          <div>
            <div className="font-bebas text-5xl text-[var(--accent-red)] mb-2">9</div>
            <div className="font-sans text-sm uppercase tracking-widest text-[var(--text-secondary)]">Regions</div>
          </div>
          <div>
            <div className="font-bebas text-5xl text-[var(--accent-red)] mb-2">18</div>
            <div className="font-sans text-sm uppercase tracking-widest text-[var(--text-secondary)]">Power Types</div>
          </div>
          <div>
            <div className="font-bebas text-5xl text-[var(--accent-red)] mb-2">∞</div>
            <div className="font-sans text-sm uppercase tracking-widest text-[var(--text-secondary)]">Combinations</div>
          </div>
        </div>
      </section>

      {/* GENERATION CTA BANNER */}
      <section className="border-t border-[var(--border)] mb-0">
        <div 
          className="w-full py-16 px-8"
          style={{ background: "linear-gradient(135deg, var(--bg-elevated) 0%, rgba(230,57,70,0.05) 100%)" }}
        >
          <div className="max-w-7xl mx-auto">
            <span className="block text-xs text-[var(--accent-red)] uppercase tracking-wider mb-2 font-sans">
              EXPLORE
            </span>
            <h2 className="font-bebas text-5xl text-[var(--text-primary)] mb-6">
              Every Generation Ever Born
            </h2>
            <p className="font-sans text-base text-[var(--text-secondary)] max-w-lg mb-8 leading-relaxed">
              From the nostalgic fields of Kanto to the open landscapes of Paldea. We've cataloged every regional form, mega evolution, and legendary encounter.
            </p>
            <Link 
              href="/generations" 
              className="inline-block border border-[var(--accent-red)] text-[var(--accent-red)] px-6 py-3 rounded-lg hover:bg-[var(--accent-red)] hover:text-white transition-colors"
            >
              Browse Generations →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
