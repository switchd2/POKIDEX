import Image from "next/image";
import TypeBadge from "./TypeBadge";
import StatPill from "./StatPill";

interface PokemonData {
  name: string;
  nationalDex: number;
  types: { type: { name: string } }[];
  sprites: { label: string; url: string }[];
  stats: { statName: string; baseValue: number }[];
}

interface FeaturedCardProps {
  pokemon: PokemonData;
}

export default function FeaturedCard({ pokemon }: FeaturedCardProps) {
  const dexNum = `#${String(pokemon.nationalDex).padStart(4, "0")}`;
  
  const sprite = pokemon.sprites?.find(s => s.label === "official-artwork");
  const imgUrl = sprite?.url ?? "/pokeball-placeholder.svg";

  const speedStat = pokemon.stats?.find(s => s.statName === "speed")?.baseValue ?? 0;
  const hpStat = pokemon.stats?.find(s => s.statName === "hp")?.baseValue ?? 0;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 w-[320px] h-[380px] relative flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2 flex-wrap max-w-[70%]">
          {pokemon.types?.map((t, idx) => (
            <TypeBadge key={idx} type={t.type.name} />
          ))}
        </div>
        <span className="font-mono text-xs text-[var(--text-muted)]">
          {dexNum}
        </span>
      </div>

      <div className="flex-grow flex items-center justify-center relative my-4">
        <Image
          src={imgUrl}
          alt={pokemon.name}
          width={200}
          height={200}
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>

      <div>
        <h3 className="font-bebas text-3xl text-[var(--text-primary)] capitalize mb-4">
          {pokemon.name}
        </h3>
        <div className="flex gap-3">
          <div className="flex-1">
            <StatPill label="HP" value={hpStat} />
          </div>
          <div className="flex-1">
            <StatPill label="SPEED" value={speedStat} />
          </div>
        </div>
      </div>
    </div>
  );
}
