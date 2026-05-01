"use client";

import { PokemonType } from "@/lib/pokeapi";

interface TypeEffectivenessProps {
  types: PokemonType[];
}

const ALL_TYPES = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export default function TypeEffectiveness({
  types,
}: TypeEffectivenessProps) {
  // Create a map of type name to type data
  const typeMap: Record<string, PokemonType> = {};
  types.forEach((t) => {
    typeMap[t.name] = t;
  });

  const getEffectiveness = (
    attackType: string,
    defendType: string
  ): string => {
    const type = typeMap[attackType];
    if (!type) return "—";

    if (type.damageRelations.doubleDamageTo.some((t) => t.name === defendType)) {
      return "2×";
    }
    if (
      type.damageRelations.halfDamageTo.some((t) => t.name === defendType)
    ) {
      return "½×";
    }
    if (type.damageRelations.noDamageTo.some((t) => t.name === defendType)) {
      return "0×";
    }
    return "1×";
  };

  return (
    <div className="overflow-x-auto border border-black">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 border-b border-black">
            <th className="border-r border-black px-3 py-2 font-mono text-xs font-bold uppercase sticky left-0 bg-gray-100 w-20">
              ATK / DEF
            </th>
            {ALL_TYPES.map((type) => (
              <th
                key={type}
                className="border-r border-black px-2 py-1 font-mono text-xs font-bold uppercase w-12 text-center"
              >
                {type.substring(0, 3).toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ALL_TYPES.map((attackType, rowIndex) => (
            <tr
              key={attackType}
              className={`border-b border-black last:border-b-0 ${
                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <th className="border-r border-black px-3 py-1 font-mono text-xs font-bold uppercase sticky left-0 z-10 text-left w-20 bg-gray-100">
                {attackType.substring(0, 3).toUpperCase()}
              </th>
              {ALL_TYPES.map((defendType) => (
                <td
                  key={`${attackType}-${defendType}`}
                  className="border-r border-black px-2 py-1 text-center font-mono text-xs font-bold last:border-r-0"
                >
                  {getEffectiveness(attackType, defendType)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
