import Image from 'next/image';
import { PokemonBase, getArtworkUrl } from '@/lib/pokedex-utils';

const TYPE_COLORS: Record<string, string> = {
  fire: '#ef8834', water: '#4d90d5', grass: '#63bb5b',
  poison: '#ab6ac8', flying: '#89aae3', electric: '#f4d23c',
  psychic: '#f97176', dragon: '#0a6dc4', ghost: '#5269ad',
  normal: '#9198a1', ice: '#74cec0', fighting: '#ce4069',
  rock: '#c5b78c', ground: '#d97746', bug: '#90c12c',
  steel: '#5a8ea2', fairy: '#ec8fe6', dark: '#5a5366',
};

interface PokemonCardProps {
  pokemon: PokemonBase;
  onClick: () => void;
}

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const artworkUrl = getArtworkUrl(pokemon.id);
  
  return (
    <div 
      className="pokemon-card cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative mb-4 flex items-center justify-center bg-slate-50/50 rounded-2xl p-4 aspect-square overflow-hidden">
        <div className="absolute inset-0 bg-slate-100/50 rounded-2xl scale-95 group-hover:scale-100 transition-transform duration-300"></div>
        <Image
          src={artworkUrl}
          alt={pokemon.name}
          width={150}
          height={150}
          loading="lazy"
          className="object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <p className="pokemon-id font-mono">
        #{String(pokemon.id).padStart(4, '0')}
      </p>
      <h3 className="pokemon-name text-slate-800">{pokemon.name}</h3>
      <div className="type-list">
        {pokemon.types.map(t => (
          <span
            key={t}
            className="type-badge"
            style={{ background: TYPE_COLORS[t.toLowerCase()] ?? '#888' }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
