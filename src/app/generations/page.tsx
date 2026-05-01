import { getAllGenerations } from "@/lib/pokeapi";

export const metadata = {
  title: "Generations - PokéWiki",
  description: "Pokémon generations timeline from Generation I to IX.",
};

const GENERATION_INFO = [
  {
    id: 1,
    roman: "I",
    name: "Red/Blue/Yellow",
    year: 1996,
    region: "Kanto",
    pokemon: 151,
    description:
      "It all began in Kanto. Pokémon Red and Green (Blue internationally) revolutionized gaming when they launched on Nintendo Game Boy in Japan on February 27, 1996.",
    legendaryPokemon: ["articuno", "zapdos", "moltres", "mewtwo"],
  },
  {
    id: 2,
    roman: "II",
    name: "Gold/Silver/Crystal",
    year: 1999,
    region: "Johto",
    pokemon: 100,
    description:
      "Generation II introduced the Johto region and made the leap to Game Boy Color. With 100 new Pokémon species and a time element, players could experience day and night cycles.",
    legendaryPokemon: ["raikou", "entei", "suicune", "lugia", "ho-oh"],
  },
  {
    id: 3,
    roman: "III",
    name: "Ruby/Sapphire/Emerald",
    year: 2002,
    region: "Hoenn",
    pokemon: 135,
    description:
      "Generation III brought Pokémon to the Game Boy Advance with full color graphics. The Hoenn region introduced double battles and weather effects to gameplay.",
    legendaryPokemon: ["kyogre", "groudon", "rayquaza"],
  },
  {
    id: 4,
    roman: "IV",
    name: "Diamond/Pearl/Platinum",
    year: 2006,
    region: "Sinnoh",
    pokemon: 107,
    description:
      "Generation IV debuted on Nintendo DS, introducing the Physical/Special split that forever changed competitive Pokémon. The Sinnoh region brought new evolutions and 107 species.",
    legendaryPokemon: ["dialga", "palkia", "giratina"],
  },
  {
    id: 5,
    roman: "V",
    name: "Black/White/Black 2/White 2",
    year: 2010,
    region: "Unova",
    pokemon: 156,
    description:
      "Generation V was a soft reboot featuring only new Pokémon in the main campaign. The Unova region was inspired by New York City and introduced challenging gym leaders and rivals.",
    legendaryPokemon: ["reshiram", "zekrom", "kyurem"],
  },
  {
    id: 6,
    roman: "VI",
    name: "X/Y",
    year: 2013,
    region: "Kalos",
    pokemon: 72,
    description:
      "Generation VI was the transition to 3D graphics on Nintendo 3DS. Mega Evolution was introduced as a powerful temporary transformation, revolutionizing competitive play.",
    legendaryPokemon: ["xerneas", "yveltal", "zygarde"],
  },
  {
    id: 7,
    roman: "VII",
    name: "Sun/Moon/Ultra Sun/Ultra Moon",
    year: 2016,
    region: "Alola",
    pokemon: 88,
    description:
      "Generation VII replaced gyms with trials in a Hawaii-inspired region. Ultra Beasts were introduced as mysterious interdimensional entities, and Alolan forms gave new looks to classic Pokémon.",
    legendaryPokemon: ["solgaleo", "lunala", "necrozma"],
  },
  {
    id: 8,
    roman: "VIII",
    name: "Sword/Shield",
    year: 2019,
    region: "Galar",
    pokemon: 96,
    description:
      "Generation VIII brought Pokémon to Nintendo Switch with full 3D open areas. Dynamax made Pokémon grow to gigantic sizes mid-battle, and the Pokédex was not complete.",
    legendaryPokemon: ["zacian", "zamazenta", "eternatus"],
  },
  {
    id: 9,
    roman: "IX",
    name: "Scarlet/Violet",
    year: 2022,
    region: "Paldea",
    pokemon: 120,
    description:
      "Generation IX introduced a fully open world with multiple campaign storylines. Terastallization replaced Dynamax, allowing Pokémon to change types mid-battle for strategic depth.",
    legendaryPokemon: ["koraidon", "miraidon"],
  },
];

export default async function GenerationsPage() {
  return (
    <div className="w-full bg-white">

      <main className="mx-auto max-w-4xl px-6 py-12 md:px-12">
        {/* Header */}
        <div className="mb-12 border-b border-black pb-8">
          <h1
            className="mb-2 text-5xl font-bold uppercase tracking-tight md:text-6xl"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            GENERATIONS
          </h1>
          <p className="font-mono text-sm text-gray-600">
            A timeline of Pokémon game releases (1996–2024)
          </p>
        </div>

        {/* Generations Timeline */}
        <div className="space-y-12">
          {GENERATION_INFO.map((gen, index) => (
            <section key={gen.id} className="border-t border-black pt-8 first:border-t-0 first:pt-0">
              <div className="mb-4 flex items-baseline justify-between">
                <h2
                  className="text-4xl font-bold uppercase tracking-tight md:text-5xl"
                  style={{ fontFamily: "Bebas Neue, sans-serif" }}
                >
                  GEN {gen.roman}
                </h2>
                <span className="font-mono text-sm font-bold text-gray-600">
                  {gen.year}
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <p className="font-mono text-xs text-gray-600 mb-2 uppercase tracking-widest">
                    Games
                  </p>
                  <p className="font-mono font-bold">{gen.name}</p>
                </div>

                <div>
                  <p className="font-mono text-xs text-gray-600 mb-2 uppercase tracking-widest">
                    Region
                  </p>
                  <p className="font-mono font-bold uppercase">{gen.region}</p>
                </div>

                <div>
                  <p className="font-mono text-xs text-gray-600 mb-2 uppercase tracking-widest">
                    New Pokémon
                  </p>
                  <p className="font-mono font-bold">{gen.pokemon}</p>
                </div>
              </div>

              <p className="mt-6 font-mono text-sm leading-relaxed">
                {gen.description}
              </p>

              {gen.legendaryPokemon.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="font-mono text-xs text-gray-600 uppercase tracking-widest">
                    Legendary Pokémon
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {gen.legendaryPokemon.map((pokemon) => (
                      <span
                        key={pokemon}
                        className="border border-black px-3 py-1 font-mono text-xs font-bold uppercase"
                      >
                        {pokemon}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {index < GENERATION_INFO.length - 1 && (
                <div className="my-8 border-b-2 border-black"></div>
              )}
            </section>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-black bg-gray-50 px-6 py-8 text-center md:px-12">
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
