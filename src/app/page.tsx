import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { getPokemonList } from "@/lib/pokeapi";

export const metadata = {
  title: "PokéWiki - The Complete Pokémon Encyclopedia",
  description:
    "1,025 Pokémon. 9 Generations. Every detail documented.",
};

async function getRandomFeatured() {
  const list = await getPokemonList(10, 0);
  return list.results.slice(0, 3);
}

export default async function Home() {
  const featured = await getRandomFeatured();

  const searchItems = featured.map((p) => ({
    name: p.name,
    id: parseInt(p.url.split("/").filter(Boolean).pop() || "0"),
    type: "pokemon" as const,
  }));

  return (
    <div className="w-full bg-white">

      <main className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <section className="border-b border-black px-6 py-12 md:py-24 md:px-12">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            {/* Left: Heading */}
            <div className="flex flex-col justify-center">
              <h1
                className="mb-6 text-5xl font-bold uppercase leading-tight tracking-tight md:text-7xl"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                THE COMPLETE POKÉMON ENCYCLOPEDIA
              </h1>
              <p className="font-mono text-sm uppercase tracking-widest text-gray-600">
                1,025 Pokémon · 9 Generations · Every Detail Documented
              </p>
            </div>

            {/* Right: Featured Image */}
            <div className="flex items-center justify-center">
              <div className="h-64 w-64 border border-black bg-gray-50 flex items-center justify-center">
                <img
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/1.png"
                  alt="Bulbasaur"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Search */}
        <section className="border-b border-black px-6 py-8 md:px-12">
          <SearchBar items={searchItems} autoFocus={false} />
        </section>

        {/* Stats Strip */}
        <section className="border-b border-black">
          <div className="flex flex-col divide-y divide-black md:flex-row md:divide-y-0 md:divide-x md:divide-black">
            <div className="flex-1 px-6 py-4 text-center md:px-12 md:py-6">
              <div className="font-mono text-2xl font-bold">1025</div>
              <div className="font-mono text-xs uppercase tracking-widest text-gray-600">
                Pokémon
              </div>
            </div>
            <div className="flex-1 px-6 py-4 text-center md:px-12 md:py-6">
              <div className="font-mono text-2xl font-bold">18</div>
              <div className="font-mono text-xs uppercase tracking-widest text-gray-600">
                Types
              </div>
            </div>
            <div className="flex-1 px-6 py-4 text-center md:px-12 md:py-6">
              <div className="font-mono text-2xl font-bold">9</div>
              <div className="font-mono text-xs uppercase tracking-widest text-gray-600">
                Generations
              </div>
            </div>
            <div className="flex-1 px-6 py-4 text-center md:px-12 md:py-6">
              <div className="font-mono text-2xl font-bold">1996</div>
              <div className="font-mono text-xs uppercase tracking-widest text-gray-600">
                Since
              </div>
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="border-b border-black px-6 py-12 md:px-12">
          <h2
            className="mb-8 text-2xl font-bold uppercase tracking-widest md:text-3xl"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            Featured This Week
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {featured.map((pokemon, index) => {
              const id = pokemon.url.split("/").filter(Boolean).pop();
              return (
                <Link
                  key={pokemon.name}
                  href={`/pokemon/${pokemon.name}`}
                  className="group border border-black p-4 hover:bg-black hover:text-white transition-colors"
                >
                  <div className="mb-3 text-xs font-mono font-bold text-gray-400 group-hover:text-gray-200">
                    #{String(id).padStart(4, "0")}
                  </div>
                  <div className="mb-3 h-24 bg-gray-50 group-hover:bg-gray-800 border border-black flex items-center justify-center">
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/${id}.png`}
                      alt={pokemon.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="font-mono text-sm font-bold uppercase">
                    {pokemon.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Navigation Tiles */}
        <section className="px-6 py-12 md:px-12">
          <div className="space-y-1">
            <Link
              href="/pokedex"
              className="block border border-black px-6 py-6 font-mono text-lg font-bold uppercase hover:bg-black hover:text-white transition-colors md:px-8"
            >
              → Browse All Pokémon (001–1025)
            </Link>
            <Link
              href="/generations"
              className="block border border-black px-6 py-6 font-mono text-lg font-bold uppercase hover:bg-black hover:text-white transition-colors md:px-8"
            >
              → Explore Generations (I–IX)
            </Link>
            <Link
              href="/history"
              className="block border border-black px-6 py-6 font-mono text-lg font-bold uppercase hover:bg-black hover:text-white transition-colors md:px-8"
            >
              → Read The Full History
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black bg-gray-50 px-6 py-8 text-center md:px-12">
        <p className="font-mono text-xs text-gray-600">
          PokéWiki © 2024 · Data from{" "}
          <a
            href="https://pokeapi.co"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-black"
          >
            PokéAPI
          </a>
        </p>
      </footer>
    </div>
  );
}
