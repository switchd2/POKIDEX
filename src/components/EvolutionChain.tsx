"use client";

import Link from "next/link";
import PokemonSprite from "./PokemonSprite";
import { EvolutionChainLink } from "@/lib/pokeapi";

interface EvolutionChainProps {
  chain: EvolutionChainLink;
  pokemonSpriteMap: Record<string, string>;
}

interface ChainNode {
  name: string;
  sprite: string;
  condition: string;
}

function buildChainArray(
  link: EvolutionChainLink,
  spriteMap: Record<string, string>,
  chain: ChainNode[] = []
): ChainNode[] {
  const current: ChainNode = {
    name: link.species.name,
    sprite: spriteMap[link.species.name] || "",
    condition: "",
  };

  chain.push(current);

  if (link.evolvesTo.length > 0) {
    // Get the first evolution condition for display
    const firstEvolution = link.evolvesTo[0];
    if (firstEvolution.evolutionDetails.length > 0) {
      const detail = firstEvolution.evolutionDetails[0];
      if (detail.minLevel) {
        current.condition = `LVL ${detail.minLevel}`;
      } else if (detail.item) {
        current.condition = detail.item.name.toUpperCase().replace(/-/g, " ");
      } else if (detail.trigger?.name === "trade") {
        current.condition = "TRADE";
      } else if (detail.trigger?.name) {
        current.condition = detail.trigger.name.toUpperCase().replace(/-/g, " ");
      }
    }

    // Build the next evolutions
    firstEvolution.evolvesTo.forEach((nextLink) => {
      buildChainArray(nextLink, spriteMap, chain);
    });

    // If there's a second evolution (alternate), display it
    if (link.evolvesTo.length > 1) {
      link.evolvesTo.slice(1).forEach((altLink) => {
        buildChainArray(altLink, spriteMap, []);
      });
    }
  }

  return chain;
}

export default function EvolutionChain({
  chain,
  pokemonSpriteMap,
}: EvolutionChainProps) {
  const chainArray = buildChainArray(chain, pokemonSpriteMap);

  if (chainArray.length === 0) {
    return <div className="py-4 font-mono text-gray-500">No evolution data</div>;
  }

  return (
    <div className="border-t border-black py-6">
      <h3 className="mb-6 text-lg font-bold uppercase tracking-wider">
        Evolution Chain
      </h3>

      {/* Desktop: Horizontal layout */}
      <div className="hidden gap-8 md:flex md:overflow-x-auto md:pb-4">
        {chainArray.map((node, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-shrink-0">
            <Link href={`/pokemon/${node.name}`} className="group">
              {node.sprite ? (
                <img
                  src={node.sprite}
                  alt={node.name}
                  className="h-24 w-24 bg-gray-100 border border-black group-hover:bg-black group-hover:invert transition-colors"
                />
              ) : (
                <div className="h-24 w-24 border border-black bg-gray-100" />
              )}
            </Link>
            <Link
              href={`/pokemon/${node.name}`}
              className="font-mono text-sm font-bold uppercase hover:underline"
            >
              {node.name}
            </Link>
            {node.condition && index < chainArray.length - 1 && (
              <div className="font-mono text-xs text-gray-600 text-center">
                {node.condition}
              </div>
            )}
            {index < chainArray.length - 1 && (
              <div className="mt-2 text-lg font-bold">→</div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: Vertical layout */}
      <div className="md:hidden flex flex-col gap-4">
        {chainArray.map((node, index) => (
          <div key={index}>
            <Link href={`/pokemon/${node.name}`} className="group">
              {node.sprite ? (
                <img
                  src={node.sprite}
                  alt={node.name}
                  className="h-20 w-20 bg-gray-100 border border-black group-hover:bg-black group-hover:invert transition-colors"
                />
              ) : (
                <div className="h-20 w-20 border border-black bg-gray-100" />
              )}
            </Link>
            <Link
              href={`/pokemon/${node.name}`}
              className="font-mono text-sm font-bold uppercase hover:underline block mt-2"
            >
              {node.name}
            </Link>
            {node.condition && index < chainArray.length - 1 && (
              <div className="font-mono text-xs text-gray-600 my-2">
                {node.condition}
              </div>
            )}
            {index < chainArray.length - 1 && (
              <div className="my-2 text-lg font-bold">↓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
