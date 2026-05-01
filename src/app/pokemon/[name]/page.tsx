import { notFound } from "next/navigation";
import Link from "next/link";
import FlavorTextList from "@/components/FlavorTextList";
import StatBar from "@/components/StatBar";
import EvolutionChain from "@/components/EvolutionChain";
import MoveTable from "@/components/MoveTable";
import { getPokemon } from "@/lib/api";

interface PokemonPageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: PokemonPageProps) {
  const { name } = await params;
  try {
    const pokemon = await getPokemon(name);
    return {
      title: `${pokemon.name} - PokéWiki`,
      description: `#${pokemon.nationalDex} ${pokemon.name} - Complete Pokédex entry with stats, moves, evolution chain, and more.`,
    };
  } catch {
    return {
      title: "Pokémon Not Found - PokéWiki",
    };
  }
}

export default async function PokemonPage({ params }: PokemonPageProps) {
  const { name } = await params;

  try {
    const pokemon = await getPokemon(name);

    // Get previous and next Pokémon (using our new navigation endpoint)
    const navRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/pokemon/${pokemon.id}/navigation`).then(res => res.json());
    const { prev, next } = navRes.data;

    const artworkUrl = pokemon.sprites.find((s: any) => s.label === 'official-artwork')?.url || `https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/${pokemon.nationalDex}.png`;

    const getStat = (name: string) => pokemon.stats.find((s: any) => s.statName === name)?.baseValue || 0;

    return (
      <div className="min-h-screen w-full bg-white">

        <main className="mx-auto max-w-7xl px-6 py-8 md:px-12 md:py-12">
          {/* Navigation & Title */}
          <div className="mb-8 border-b border-black pb-6">
            <div className="mb-4 flex items-center justify-between">
              {prev ? (
                <Link
                  href={`/pokemon/${prev.slug}`}
                  className="font-mono text-xs font-bold hover:underline"
                >
                  ← #{String(prev.id).padStart(4, "0")} {prev.name}
                </Link>
              ) : (
                <div className="font-mono text-xs text-gray-300">← #0000</div>
              )}

              <h1
                className="text-center text-4xl font-bold uppercase tracking-tight md:text-5xl"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {pokemon.name}
              </h1>

              {next ? (
                <Link
                  href={`/pokemon/${next.slug}`}
                  className="text-right font-mono text-xs font-bold hover:underline"
                >
                  #{String(next.id).padStart(4, "0")} {next.name} →
                </Link>
              ) : (
                <div className="text-right font-mono text-xs text-gray-300">
                  #0000 →
                </div>
              )}
            </div>

            <div className="text-center font-mono text-sm text-gray-600">
              {pokemon.genus} · {pokemon.types.map((t: any) => t.type.nameDisplay).join(" / ")} ·
              Generation {pokemon.generationId}
            </div>
          </div>

          {/* Hero Split: Image + Info */}
          <div className="mb-12 grid gap-8 md:grid-cols-2">
            {/* Left: Artwork */}
            <div className="flex flex-col gap-6">
              <div className="border border-black bg-gray-50 flex items-center justify-center" style={{ aspectRatio: "1" }}>
                {artworkUrl && (
                  <img
                    src={artworkUrl}
                    alt={pokemon.name}
                    className="h-full w-full object-contain p-6"
                  />
                )}
              </div>

              {/* Sprites */}
              <div className="border border-black p-4">
                <p className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-gray-600">
                  Sprites
                </p>
                <div className="flex gap-2 overflow-x-auto">
                  {pokemon.sprites.map((sprite: any, i: number) => (
                    <div
                      key={i}
                      className="h-12 w-12 flex-shrink-0 border border-black bg-gray-100 flex items-center justify-center"
                    >
                      <img src={sprite.url} alt={sprite.label} className="h-full w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Data Blocks */}
            <div className="space-y-1 border border-black divide-y divide-black">
              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">NATIONAL DEX</div>
                <div className="font-mono text-xl font-bold">
                  #{String(pokemon.nationalDex).padStart(4, "0")}
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">SPECIES</div>
                <div className="font-mono text-lg font-bold uppercase">{pokemon.genus}</div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">TYPE</div>
                <div className="font-mono text-lg font-bold uppercase">
                  {pokemon.types.map((t: any) => t.type.nameDisplay).join(" / ")}
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">HEIGHT</div>
                <div className="font-mono text-lg font-bold">{pokemon.height} m</div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">WEIGHT</div>
                <div className="font-mono text-lg font-bold">{pokemon.weight} kg</div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">BASE EXP</div>
                <div className="font-mono text-lg font-bold">{pokemon.baseExp}</div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">CAPTURE RATE</div>
                <div className="font-mono text-lg font-bold">{pokemon.catchRate}</div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">BASE HAPPINESS</div>
                <div className="font-mono text-lg font-bold">{pokemon.baseFriendship}</div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">GROWTH RATE</div>
                <div className="font-mono text-lg font-bold uppercase">{pokemon.growthRate}</div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">GENDER RATIO</div>
                <div className="font-mono text-sm font-bold">{pokemon.genderRatio}</div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">EGG GROUPS</div>
                <div className="font-mono text-sm font-bold uppercase">
                  {pokemon.eggGroups.map((g: any) => g.eggGroup.name).join(", ")}
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">HATCH TIME</div>
                <div className="font-mono text-lg font-bold">{pokemon.hatchTime} cycles</div>
              </div>
            </div>
          </div>

          {/* Biology */}
          <section className="mb-12 border-t border-black pt-6">
            <h2 className="mb-4 text-2xl font-bold uppercase" style={{ fontFamily: "Bebas Neue, sans-serif" }}>Biology</h2>
            <p className="font-mono text-sm leading-relaxed text-gray-700">{pokemon.description}</p>
          </section>

          {/* Abilities Section */}
          <section className="mb-12 border-t border-black pt-6">
            <h2
              className="mb-6 text-2xl font-bold uppercase tracking-wide"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              Abilities
            </h2>
            <div className="space-y-1 border border-black divide-y divide-black">
              {pokemon.abilities.map((ability: any, index: number) => (
                <div key={index} className="px-4 py-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-sm font-bold uppercase">
                      {ability.ability.nameDisplay}
                    </span>
                    <span className="font-mono text-xs font-bold uppercase text-gray-500">
                      {ability.isHidden ? "[HIDDEN]" : "[STANDARD]"}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-gray-600">
                    {ability.ability.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Base Stats Section */}
          <section className="mb-12 border-t border-black pt-6">
            <h2
              className="mb-6 text-2xl font-bold uppercase tracking-wide"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              Base Stats
            </h2>
            <div className="border border-black">
              <StatBar name="HP" value={getStat("hp")} />
              <StatBar name="ATK" value={getStat("attack")} />
              <StatBar name="DEF" value={getStat("defense")} />
              <StatBar name="SP. ATK" value={getStat("sp_atk")} />
              <StatBar name="SP. DEF" value={getStat("sp_def")} />
              <StatBar name="SPD" value={getStat("speed")} />
              <div className="border-t-2 border-black px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold uppercase tracking-wider">
                    TOTAL
                  </span>
                  <span className="font-mono text-lg font-bold">
                    {pokemon.stats.reduce((sum: number, stat: any) => sum + stat.baseValue, 0)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Flavor Text */}
          {pokemon.flavorTexts.length > 0 && (
            <section className="mb-12 border-t border-black pt-6">
              <h2
                className="mb-4 text-2xl font-bold uppercase tracking-wide"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                Pokédex Entries
              </h2>
              <FlavorTextList entries={pokemon.flavorTexts.map((f: any) => ({
                flavorText: f.text,
                version: { name: f.gameVersion }
              }))} />
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-black bg-gray-50 px-6 py-8 text-center md:px-12">
          <p className="font-mono text-xs text-gray-600">
            PokéWiki © 2024 · Data from Bulbapedia
          </p>
        </footer>
      </div>
    );
  } catch (error) {
    console.error("Error loading Pokémon:", error);
    notFound();
  }
}
