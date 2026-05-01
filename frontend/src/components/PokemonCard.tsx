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
    <Link href={`/pokemon/${pokemon.name.toLowerCase()}`} className="block">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 hover:border-[var(--accent-blue)] hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full flex flex-col relative group">
        <div className="flex justify-between items-start mb-2">
          <span className="font-mono text-xs text-[var(--text-muted)]">
            {dexNum}
          </span>
          <div className="flex flex-col gap-1 items-end max-w-[60%]">
            {pokemon.types?.map((t, idx) => (
              <TypeBadge key={idx} type={t.type.name} />
            ))}
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center my-4 relative">
          <Image
            src={imgUrl}
            alt={pokemon.name}
            width={96}
            height={96}
            className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <h3 className="font-sans font-semibold text-sm text-[var(--text-primary)] text-center capitalize mt-auto">
          {pokemon.name}
        </h3>
      </div>
    </Link>
  );
}
