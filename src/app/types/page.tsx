import TypeEffectiveness from "@/components/TypeEffectiveness";
import { getAllTypes, getType } from "@/lib/pokeapi";

export const metadata = {
  title: "Type Chart - PokéWiki",
  description: "Pokémon type effectiveness chart and individual type information.",
};

export default async function TypesPage() {
  try {
    const typesList = await getAllTypes();
    const typesData = await Promise.all(
      typesList.results.map((t) => getType(t.name))
    );

    return (
      <div className="w-full bg-white">

        <main className="mx-auto max-w-7xl px-6 py-12 md:px-12">
          {/* Header */}
          <div className="mb-12 border-b border-black pb-8">
            <h1
              className="mb-2 text-5xl font-bold uppercase tracking-tight md:text-6xl"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              TYPE CHART
            </h1>
            <p className="font-mono text-sm text-gray-600">
              Pokémon type effectiveness reference
            </p>
          </div>

          {/* Type Effectiveness Chart */}
          <section className="mb-12">
            <h2
              className="mb-6 text-2xl font-bold uppercase tracking-wide"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              Effectiveness Matrix
            </h2>
            <p className="mb-6 font-mono text-sm text-gray-600">
              Read horizontally for attack effectiveness (what does this type deal),
              vertically for defense (what damages this type).
            </p>
            <TypeEffectiveness types={typesData} />
          </section>

          {/* Individual Types */}
          <section>
            <h2
              className="mb-6 text-2xl font-bold uppercase tracking-wide"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              Individual Types
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {typesData.map((type) => (
                <div
                  key={type.name}
                  className="border border-black p-6 space-y-4"
                >
                  <h3 className="font-mono text-lg font-bold uppercase">
                    {type.name}
                  </h3>

                  <div>
                    <p className="font-mono text-xs text-gray-600 mb-2 uppercase tracking-widest">
                      Super Effective Against
                    </p>
                    <p className="font-mono text-sm">
                      {type.damageRelations.doubleDamageTo
                        .map((t) => t.name.toUpperCase())
                        .join(", ") || "None"}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-xs text-gray-600 mb-2 uppercase tracking-widest">
                      Weak To
                    </p>
                    <p className="font-mono text-sm">
                      {type.damageRelations.doubleDamageFrom
                        .map((t) => t.name.toUpperCase())
                        .join(", ") || "None"}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-xs text-gray-600 mb-2 uppercase tracking-widest">
                      Resists
                    </p>
                    <p className="font-mono text-sm">
                      {type.damageRelations.halfDamageFrom
                        .map((t) => t.name.toUpperCase())
                        .join(", ") || "None"}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-xs text-gray-600 mb-2 uppercase tracking-widest">
                      Immune To
                    </p>
                    <p className="font-mono text-sm">
                      {type.damageRelations.noDamageFrom
                        .map((t) => t.name.toUpperCase())
                        .join(", ") || "None"}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-xs text-gray-600 mb-2 uppercase tracking-widest">
                      Pokémon Count
                    </p>
                    <p className="font-mono text-sm font-bold">
                      {type.pokemon.length}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
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
  } catch (error) {
    console.error("Error loading types:", error);
    return (
      <div className="w-full bg-white">
        <main className="mx-auto max-w-7xl px-6 py-12">
          <p className="font-mono text-red-600">Error loading type data</p>
        </main>
      </div>
    );
  }
}
