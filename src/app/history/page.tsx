
export const metadata = {
  title: "History - PokéWiki",
  description: "The complete history of Pokémon from 1996 to present.",
};

export default function HistoryPage() {
  return (
    <div className="w-full bg-white">

      <main className="mx-auto max-w-3xl px-6 py-12 md:px-12">
        {/* Header */}
        <div className="mb-12 border-b border-black pb-8">
          <h1
            className="mb-2 text-5xl font-bold uppercase tracking-tight md:text-6xl"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            HISTORY
          </h1>
          <p className="font-mono text-sm text-gray-600">
            The complete history of the Pokémon franchise
          </p>
        </div>

        {/* Content */}
        <article className="space-y-12 font-mono text-sm leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2
              className="mb-4 text-3xl font-bold uppercase tracking-tight"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              Origins (1989–1995)
            </h2>
            <p className="mb-4">
              Pokémon began its life when two companies collided with a shared vision. Ken
              Sugimori, a talented artist, and Satoshi Tajiri, a visionary designer, met at
              Game Freak, a small video game company founded in 1989. Sugimori had been
              creating pixel art since childhood, drawing insects obsessively. Tajiri's
              childhood hobby was collecting insects—he would spend hours in the
              countryside catching them.
            </p>
            <p>
              In 1995, Tajiri pitched a game based on this shared passion: creatures that
              could be caught, trained, and battled. The pair began working on what would
              become Pokémon, starting with 150 creatures and a Game Boy engine capable of
              connecting players through cable for battles and trading.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2
              className="mb-4 text-3xl font-bold uppercase tracking-tight"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              Pocket Monsters (1996–1997)
            </h2>
            <p className="mb-4">
              "Pocket Monsters Red" and "Pocket Monsters Green" launched on February 27, 1996,
              in Japan for Nintendo Game Boy. The games were an immediate phenomenon. Players
              were captivated by the simple yet addictive gameplay loop: catch Pokémon, train
              them, battle other trainers, and fill the Pokédex.
            </p>
            <p className="mb-4">
              The genius of Pokémon was in its social design. Two players needed different
              versions (Red vs. Green) to catch all creatures, forcing social interaction
              and trading. A Game Boy link cable connected friends in a ritual that became
              cultural.
            </p>
            <p>
              "Pocket Monsters Blue" was released to Japan in September 1996, followed by
              "Pokémon Red" and "Pokémon Blue" in North America in September 1998, changing
              the trajectory of the entire games industry.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2
              className="mb-4 text-3xl font-bold uppercase tracking-tight"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              The Anime & Pikachu Phenomenon (1997–2000)
            </h2>
            <p className="mb-4">
              On April 1, 1997, the Pokémon anime debuted on TV Tokyo. Following young trainer
              Ash Ketchum and his Pikachu, the series became a cultural juggernaut,
              particularly in Japan. The anime introduced the world to Pokémon through
              accessible, approachable storytelling.
            </p>
            <p className="mb-4">
              Pikachu, the series' mascot, became an icon rivaling only Mickey Mouse in global
              recognition. The anime drove game sales—children worldwide begged parents for Game
              Boys and Pokémon cartridges after seeing the show.
            </p>
            <p>
              By 1999, Pokémon was a multi-media phenomenon: games, anime, trading cards, toys,
              and merchandise. The franchise had become a $4 billion industry, with no signs of
              slowing down.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2
              className="mb-4 text-3xl font-bold uppercase tracking-tight"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              Trading Card Game (1996–2000)
            </h2>
            <p className="mb-4">
              While most remember Pokémon through games and anime, the Trading Card Game was
              equally pivotal. Launched in 1996 in Japan and 1999 in North America, the TCG
              became a cultural phenomenon of its own.
            </p>
            <p className="mb-4">
              First edition Base Set cards became among the most valuable trading cards ever
              printed. A pristine Charizard card sold for hundreds of thousands of dollars at
              auction. The TCG created a secondary market and drove collectibility to new
              heights.
            </p>
            <p>
              The TCG sustained the franchise through market fluctuations, creating a community
              that persists to this day. Even as video game interest waxes and wanes, the TCG
              remains culturally significant.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2
              className="mb-4 text-3xl font-bold uppercase tracking-tight"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              Generation II: Johto (1999–2001)
            </h2>
            <p className="mb-4">
              "Pokémon Gold" and "Pokémon Silver" released in Japan on November 21, 1999, for
              the Game Boy Color. For the first time, players could transfer their Pokémon
              from the original games and continue their journey in a new region.
            </p>
            <p className="mb-4">
              Johto introduced 100 new Pokémon and established the formula that would persist:
              eight gyms, an elite four, and a champion. It also introduced a day-night cycle,
              giving Pokémon different encounter rates at different times.
            </p>
            <p>
              Gen II proved the franchise wasn't a fad—it was sustainable, expandable, and
              endlessly deep. The idea of multiple generations became the franchise's greatest
              strength.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2
              className="mb-4 text-3xl font-bold uppercase tracking-tight"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              The Decline (2002–2004)
            </h2>
            <p className="mb-4">
              After the unprecedented success of Gens I and II, the franchise faced its first
              real market saturation. Generation III (Ruby/Sapphire on Game Boy Advance) was
              well-received, but growth plateaued. The anime, meanwhile, had become stale in
              syndication.
            </p>
            <p className="mb-4">
              Pokémon became seen as "for kids," and the teenage demographic moved on to other
              interests. The trading card market crashed after massive overproduction. Pokémania
              was over—or so everyone thought.
            </p>
            <p>
              Yet Nintendo and The Pokémon Company had long-term vision. They continued
              developing new games and cultivating a dedicated core audience rather than chasing
              casual trends.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2
              className="mb-4 text-3xl font-bold uppercase tracking-tight"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              The Revival: Diamond & Pearl (2006–2009)
            </h2>
            <p className="mb-4">
              "Pokémon Diamond" and "Pokémon Pearl" launched on Nintendo DS in Japan in
              September 2006. This generation was crucial: it introduced competitive depth
              through the Physical/Special split, new held items, and abilities that redefined
              metagame strategy.
            </p>
            <p className="mb-4">
              The DS's wireless connectivity made trading and battling effortless. Pokémon
              became social again—not through anime or cards, but through core gameplay. A new
              generation of players discovered the franchise.
            </p>
            <p>
              Gen IV proved that Pokémon could evolve mechanically and remain engaging for
              veterans while welcoming newcomers. The franchise was revived.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2
              className="mb-4 text-3xl font-bold uppercase tracking-tight"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              Mobile Era: Pokémon GO (2016)
            </h2>
            <p className="mb-4">
              On July 6, 2016, Niantic released Pokémon GO, an augmented reality game for
              smartphones. The impact was seismic. Players flooded streets, parks, and
              landmarks hunting Pokémon. The game became a cultural phenomenon comparable to
              the original 1996 launch.
            </p>
            <p className="mb-4">
              GO brought Pokémon to people who'd never owned a Game Boy. Parents, grandparents,
              and non-gamers engaged with the franchise. The game demonstrated Pokémon's
              universal appeal and proved the franchise could pioneer new technological spaces.
            </p>
            <p>
              GO remains active today, with millions of daily players. It shifted Pokémon from
              a "game you play at home" to "a game you play in the world."
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2
              className="mb-4 text-3xl font-bold uppercase tracking-tight"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              Modern Era: Switch & Beyond (2017–2024)
            </h2>
            <p className="mb-4">
              "Pokémon Let's Go Pikachu/Eevee" launched on Nintendo Switch in November 2018,
              bridging mobile gaming and home console gaming. For the first time, mainline
              Pokémon games reached a hybrid audience.
            </p>
            <p className="mb-4">
              "Pokémon Sword and Shield" (2019) were the first fully 3D mainline games, though
              the Pokédex was famously incomplete. "Pokémon Legends: Arceus" (2022) innovated
              the formula with action-oriented gameplay.
            </p>
            <p className="mb-4">
              "Pokémon Scarlet and Violet" (2022) delivered the first truly open-world Pokémon
              experience. Players could tackle content in any order, with multiple storylines
              running concurrently. The games represented the franchise's boldest evolution.
            </p>
            <p>
              Today, Pokémon is a $100+ billion franchise. It remains the highest-grossing
              media franchise of all time, surpassing Hello Kitty, Disney, and Star Wars. From
              a Game Boy game made by two obsessive collector-artists in 1996, Pokémon has
              become a global cultural force.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2
              className="mb-4 text-3xl font-bold uppercase tracking-tight"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              By The Numbers
            </h2>
            <p className="mb-4">
              1,025+ Pokémon species across nine generations (as of 2024)
            </p>
            <p className="mb-4">
              500+ million video games sold worldwide
            </p>
            <p className="mb-4">
              Billions of trading cards printed and sold
            </p>
            <p className="mb-4">
              10+ anime series spanning 1,200+ episodes
            </p>
            <p className="mb-4">
              $100+ billion franchise valuation (highest-grossing media franchise)
            </p>
            <p className="mb-4">
              200+ countries and regions where Pokémon is available
            </p>
            <p>
              What began as a simple idea—catch insects, inspired by childhood hobbies—became
              the most successful entertainment franchise in human history. Pokémon transformed
              gaming, proved that video games could be art and culture, and showed that
              creativity and vision could change the world.
            </p>
          </section>
        </article>
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
