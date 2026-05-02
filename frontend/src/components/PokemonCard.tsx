import Image from "next/image";
import TypeBadge from "./TypeBadge";
import Link from "next/link";

interface PokemonCardProps {
  pokemon: {
    name: string;
    nationalDex: number;
    types: { type: { name: string } }[];
    sprites: { label: string; url: string }[];
  };
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const dexNum = `#${String(pokemon.nationalDex).padStart(4, "0")}`;
  const sprite = pokemon.sprites?.find(s => s.label === "official-artwork");
  const imgUrl = sprite?.url ?? "/pokeball-placeholder.svg";

  return (
    <Link href={`/pages/pokemon/${pokemon.name.toLowerCase()}`} className="block h-full">
      <div className="bg-white border border-[var(--border)] rounded-2xl p-6 hover:shadow-[var(--card-shadow)] hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col relative group">
        <div className="flex justify-between items-center mb-4">
          <span className="font-mono text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            {dexNum}
          </span>
          <div className="flex gap-1">
            {pokemon.types?.map((t, idx) => (
              <TypeBadge key={idx} type={t.type.name} />
            ))}
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center my-6">
          <Image
            src={imgUrl}
            alt={pokemon.name}
            width={120}
            height={120}
            className="object-contain transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <h3 className="font-sans font-bold text-lg text-[var(--text-primary)] text-center capitalize mt-auto">
          {pokemon.name}
        </h3>
      </div>
    </Link>
  );
}
