import { notFound } from "next/navigation";
import Link from "next/link";
import FlavorTextList from "@/components/FlavorTextList";
import StatBar from "@/components/StatBar";
import EvolutionChain from "@/components/EvolutionChain";
import MoveTable from "@/components/MoveTable";
import {
  getPokemon,
  getPokemonSpecies,
  getEvolutionChain,
  getOfficialArtwork,
  getEnglishFlavorText,
  formatHeight,
  formatWeight,
  getStatByName,
  getAllPokemonNames,
} from "@/lib/pokeapi";

export async function generateStaticParams() {
  try {
    const names = await getAllPokemonNames();
    return names.map((name) => ({
      name: name,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

interface PokemonPageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: PokemonPageProps) {
  const { name } = await params;
  try {
    const pokemon = await getPokemon(name);
    return {
      title: `${pokemon.name} - PokéWiki`,
      description: `#${pokemon.id} ${pokemon.name} - Complete Pokédex entry with stats, moves, evolution chain, and more.`,
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
    const species = await getPokemonSpecies(pokemon.species.name);
    const evolutionChain = await getEvolutionChain(
      parseInt(species.evolutionChain.url.split("/").filter(Boolean).pop() || "0")
    );

    // Get previous and next Pokémon
    const prevPokemon = pokemon.id > 1 ? await getPokemon(pokemon.id - 1) : null;
    const nextPokemon = pokemon.id < 1025 ? await getPokemon(pokemon.id + 1) : null;

    const artworkUrl = getOfficialArtwork(pokemon);
    const englishEntries = species.flavorTextEntries.filter((e) => e.language.name === "en");
    const genus = species.genera.find((g) => g.language.name === "en")?.genus || "";

    // Build moves list (simplified - get level up moves only)
    const moveList = pokemon.moves
      .filter(
        (m) =>
          m.versionGroupDetails &&
          m.versionGroupDetails.some((v) => v.moveLearnMethod.name === "level-up")
      )
      .map((m) => {
        const levelDetails = m.versionGroupDetails.find(
          (v) => v.moveLearnMethod.name === "level-up"
        );
        return {
          name: m.move.name,
          level: levelDetails?.levelLearnedAt || 0,
        };
      })
      .sort((a, b) => a.level - b.level)
      .slice(0, 20);

    return (
      <div className="min-h-screen w-full bg-white">

        <main className="mx-auto max-w-7xl px-6 py-8 md:px-12 md:py-12">
          {/* Navigation & Title */}
          <div className="mb-8 border-b border-black pb-6">
            <div className="mb-4 flex items-center justify-between">
              {prevPokemon ? (
                <Link
                  href={`/pokemon/${prevPokemon.name}`}
                  className="font-mono text-xs font-bold hover:underline"
                >
                  ← #{String(prevPokemon.id).padStart(4, "0")} {prevPokemon.name}
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

              {nextPokemon ? (
                <Link
                  href={`/pokemon/${nextPokemon.name}`}
                  className="text-right font-mono text-xs font-bold hover:underline"
                >
                  #{String(nextPokemon.id).padStart(4, "0")} {nextPokemon.name} →
                </Link>
              ) : (
                <div className="text-right font-mono text-xs text-gray-300">
                  #0000 →
                </div>
              )}
            </div>

            <div className="text-center font-mono text-sm text-gray-600">
              {genus} · {pokemon.types.map((t) => t.type.name.toUpperCase()).join(" / ")} ·
              Generation {Math.ceil(pokemon.id / 151)}
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

              {/* Sprite History */}
              <div className="border border-black p-4">
                <p className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-gray-600">
                  Sprites
                </p>
                <div className="flex gap-2 overflow-x-auto">
                  {[
                    pokemon.sprites.frontDefault,
                    pokemon.sprites.backDefault,
                    pokemon.sprites.frontShiny,
                    pokemon.sprites.backShiny,
                  ]
                    .filter((s): s is string => s !== null && s !== undefined)
                    .map((sprite, i) => (
                      <div
                        key={i}
                        className="h-12 w-12 flex-shrink-0 border border-black bg-gray-100 flex items-center justify-center"
                      >
                        <img src={sprite} alt="sprite" className="h-full w-full" />
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
                  #{String(pokemon.id).padStart(4, "0")}
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">SPECIES</div>
                <div className="font-mono text-lg font-bold uppercase">{genus}</div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">TYPE</div>
                <div className="font-mono text-lg font-bold uppercase">
                  {pokemon.types.map((t) => t.type.name).join(" / ")}
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">HEIGHT</div>
                <div className="font-mono text-lg font-bold">{formatHeight(pokemon.height)}</div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">WEIGHT</div>
                <div className="font-mono text-lg font-bold">{formatWeight(pokemon.weight)}</div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">BASE EXP</div>
                <div className="font-mono text-lg font-bold">{pokemon.baseExperience}</div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">CAPTURE RATE</div>
                <div className="font-mono text-lg font-bold">
                  {species.captureRate} ({((species.captureRate / 255) * 100).toFixed(1)}%)
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">BASE HAPPINESS</div>
                <div className="font-mono text-lg font-bold">{species.baseHappiness}</div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">GROWTH RATE</div>
                <div className="font-mono text-lg font-bold uppercase">
                  {species.growthRate.name.replace(/-/g, " ")}
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">GENDER RATIO</div>
                <div className="font-mono text-sm font-bold">
                  {species.genderRate === -1
                    ? "Genderless"
                    : `${(100 - (species.genderRate / 8) * 100).toFixed(1)}% M / ${((species.genderRate / 8) * 100).toFixed(1)}% F`}
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">EGG GROUPS</div>
                <div className="font-mono text-sm font-bold uppercase">
                  {species.eggGroups.map((g) => g.name).join(", ")}
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="font-mono text-xs text-gray-600 mb-1">HATCH TIME</div>
                <div className="font-mono text-lg font-bold">
                  {species.hatchCounter * 257} steps
                </div>
              </div>
            </div>
          </div>

          {/* Abilities Section */}
          <section className="mb-12 border-t border-black pt-6">
            <h2
              className="mb-6 text-2xl font-bold uppercase tracking-wide"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              Abilities
            </h2>
            <div className="space-y-1 border border-black divide-y divide-black">
              {pokemon.abilities.map((ability, index) => (
                <div key={index} className="px-4 py-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-sm font-bold uppercase">
                      {ability.ability.name}
                    </span>
                    <span className="font-mono text-xs font-bold uppercase text-gray-500">
                      {ability.isHidden ? "[HIDDEN]" : "[STANDARD]"}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-gray-600">
                    Ability description would go here
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
              <StatBar name="HP" value={getStatByName(pokemon.stats, "hp")} />
              <StatBar name="ATK" value={getStatByName(pokemon.stats, "attack")} />
              <StatBar name="DEF" value={getStatByName(pokemon.stats, "defense")} />
              <StatBar name="SP. ATK" value={getStatByName(pokemon.stats, "spa")} />
              <StatBar name="SP. DEF" value={getStatByName(pokemon.stats, "spd")} />
              <StatBar name="SPD" value={getStatByName(pokemon.stats, "speed")} />
              <div className="border-t-2 border-black px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold uppercase tracking-wider">
                    TOTAL
                  </span>
                  <span className="font-mono text-lg font-bold">
                    {pokemon.stats.reduce((sum, stat) => sum + stat.baseStat, 0)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Evolution Chain */}
          {evolutionChain && (
            <section className="mb-12">
              <EvolutionChain
                chain={evolutionChain.chain}
                pokemonSpriteMap={{}}
              />
            </section>
          )}

          {/* Moves */}
          {moveList.length > 0 && (
            <section className="mb-12">
              <MoveTable
                moves={moveList.map((m) => ({
                  name: m.name,
                  level: m.level,
                  type: "normal",
                  category: "physical",
                  power: 100,
                  accuracy: 100,
                  pp: 35,
                }))}
              />
            </section>
          )}

          {/* Flavor Text */}
          {englishEntries.length > 0 && (
            <section className="mb-12 border-t border-black pt-6">
              <h2
                className="mb-4 text-2xl font-bold uppercase tracking-wide"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                Pokédex Entries
              </h2>
              <FlavorTextList entries={englishEntries} />
            </section>
          )}
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
  } catch (error) {
    console.error("Error loading Pokémon:", error);
    notFound();
  }
}
