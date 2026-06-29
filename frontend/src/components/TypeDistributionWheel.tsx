'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

const TYPES = [
  'normal','fire','water','electric','grass','ice',
  'fighting','poison','ground','flying','psychic','bug',
  'rock','ghost','dragon','dark','steel','fairy'
] as const;

type PokemonType = typeof TYPES[number];

const TYPE_COLORS: Record<PokemonType, string> = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0',
  electric: '#F7D02C', grass: '#7AC74C', ice: '#96D9D6',
  fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65',
  flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC',
  dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD',
};

const TYPE_ICONS: Record<PokemonType, string> = {
  normal:'⬜', fire:'🔥', water:'💧', electric:'⚡', grass:'🌿', ice:'❄️',
  fighting:'🥊', poison:'☠️', ground:'🌍', flying:'🌬️', psychic:'🔮', bug:'🐛',
  rock:'🪨', ghost:'👻', dragon:'🐉', dark:'🌑', steel:'⚙️', fairy:'✨',
};

interface TypePokemon {
  name: string;
  url: string;
  id: number;
}

interface TypeData {
  name: PokemonType;
  count: number;
  pokemon: TypePokemon[];
}

function getArtwork(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function getPokemonId(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\//);
  return match ? parseInt(match[1]) : 0;
}

export default function TypeDistributionWheel({ typeData }: { typeData: TypeData[] }) {
  const [selectedType, setSelectedType] = useState<PokemonType | null>(null);
  const [hoveredType, setHoveredType] = useState<PokemonType | null>(null);
  const [pokemonPage, setPokemonPage] = useState(0);
  const PAGE_SIZE = 12;

  const activeType = selectedType;
  const displayType = hoveredType || selectedType;

  const total = typeData.reduce((s, t) => s + t.count, 0);

  // SVG donut chart math
  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 140;
  const innerR = 78;

  let cumAngle = -Math.PI / 2;

  const slices = typeData.map((t) => {
    const fraction = t.count / total;
    const startAngle = cumAngle;
    const endAngle = cumAngle + fraction * 2 * Math.PI;
    cumAngle = endAngle;

    const isActive = displayType === t.name;
    const r = isActive ? outerR + 10 : outerR;
    const iR = innerR;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + iR * Math.cos(endAngle);
    const iy1 = cy + iR * Math.sin(endAngle);
    const ix2 = cx + iR * Math.cos(startAngle);
    const iy2 = cy + iR * Math.sin(startAngle);
    const largeArc = fraction > 0.5 ? 1 : 0;

    const midAngle = (startAngle + endAngle) / 2;
    const labelR = (r + iR) / 2;
    const lx = cx + labelR * Math.cos(midAngle);
    const ly = cy + labelR * Math.sin(midAngle);

    const d = [
      `M ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix1} ${iy1}`,
      `A ${iR} ${iR} 0 ${largeArc} 0 ${ix2} ${iy2}`,
      `Z`,
    ].join(' ');

    return {
      ...t,
      d,
      lx,
      ly,
      midAngle,
      fraction,
      isActive,
    };
  });

  const selectedData = typeData.find(t => t.name === activeType);
  const displayedPokemon = selectedData?.pokemon.slice(pokemonPage * PAGE_SIZE, (pokemonPage + 1) * PAGE_SIZE) ?? [];
  const totalPages = selectedData ? Math.ceil(selectedData.pokemon.length / PAGE_SIZE) : 0;

  const handleTypeSelect = (type: PokemonType) => {
    setSelectedType(prev => prev === type ? null : type);
    setPokemonPage(0);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Donut Chart + Type List */}
        <div className="flex-shrink-0 w-full lg:w-auto">
          {/* SVG Donut */}
          <div className="flex justify-center mb-6">
            <div className="relative inline-block">
              <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="w-full max-w-[300px] sm:max-w-[340px] h-auto drop-shadow-xl"
                style={{ overflow: 'visible' }}
              >
                {slices.map((slice) => (
                  <path
                    key={slice.name}
                    d={slice.d}
                    fill={TYPE_COLORS[slice.name]}
                    opacity={displayType && displayType !== slice.name ? 0.4 : 1}
                    stroke="white"
                    strokeWidth={2}
                    className="cursor-pointer transition-all duration-200"
                    style={{ filter: slice.isActive ? `drop-shadow(0 0 8px ${TYPE_COLORS[slice.name]}88)` : 'none' }}
                    onClick={() => handleTypeSelect(slice.name)}
                    onMouseEnter={() => setHoveredType(slice.name)}
                    onMouseLeave={() => setHoveredType(null)}
                  >
                    <title>{slice.name}: {slice.count} Pokémon ({(slice.fraction * 100).toFixed(1)}%)</title>
                  </path>
                ))}

                {/* Center text */}
                <circle cx={cx} cy={cy} r={innerR - 4} fill="white" />
                {displayType ? (
                  <>
                    <text x={cx} y={cy - 18} textAnchor="middle" fontSize="24" fill={TYPE_COLORS[displayType]} className="font-black select-none">
                      {TYPE_ICONS[displayType]}
                    </text>
                    <text x={cx} y={cy + 4} textAnchor="middle" fontSize="13" fontWeight="800" fill={TYPE_COLORS[displayType]} className="uppercase select-none">
                      {displayType}
                    </text>
                    <text x={cx} y={cy + 22} textAnchor="middle" fontSize="11" fill="#64748b" className="select-none">
                      {typeData.find(t => t.name === displayType)?.count ?? 0} Pokémon
                    </text>
                  </>
                ) : (
                  <>
                    <text x={cx} y={cy - 8} textAnchor="middle" fontSize="13" fontWeight="800" fill="#1e293b" className="select-none">
                      All Types
                    </text>
                    <text x={cx} y={cy + 10} textAnchor="middle" fontSize="11" fill="#64748b" className="select-none">
                      {total} Pokémon
                    </text>
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* Type Pills Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-1.5">
            {typeData.map((t) => (
              <button
                key={t.name}
                onClick={() => handleTypeSelect(t.name)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-left transition-all duration-200 border-2 ${
                  activeType === t.name
                    ? 'scale-105 shadow-md border-transparent'
                    : 'border-transparent hover:scale-102 bg-slate-50 hover:bg-slate-100'
                }`}
                style={activeType === t.name ? { backgroundColor: `${TYPE_COLORS[t.name]}22`, borderColor: TYPE_COLORS[t.name] } : {}}
              >
                <span className="text-sm">{TYPE_ICONS[t.name]}</span>
                <div className="min-w-0">
                  <div className="text-[10px] font-black uppercase truncate" style={{ color: TYPE_COLORS[t.name] }}>{t.name}</div>
                  <div className="text-[9px] text-slate-400 font-semibold">{t.count}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Pokémon List */}
        <div className="flex-1 min-w-0">
          {activeType && selectedData ? (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md"
                    style={{ backgroundColor: TYPE_COLORS[activeType] }}
                  >
                    {TYPE_ICONS[activeType]}
                  </div>
                  <div>
                    <h3 className="text-lg font-black capitalize" style={{ color: TYPE_COLORS[activeType] }}>{activeType}</h3>
                    <p className="text-xs text-slate-400 font-medium">{selectedData.count} Pokémon total</p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedType(null); setPokemonPage(0); }}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Clear ✕
                </button>
              </div>

              {/* Pokémon Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {displayedPokemon.map((p) => (
                  <a
                    key={p.id}
                    href={`/pages/pokemon/${p.name}`}
                    className="group flex flex-col items-center p-2 rounded-xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center mb-1.5" style={{ background: `${TYPE_COLORS[activeType]}15` }}>
                      <Image
                        src={getArtwork(p.id)}
                        alt={p.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold">#{String(p.id).padStart(4,'0')}</span>
                    <span className="text-[10px] font-black capitalize text-slate-700 truncate w-full text-center">{p.name}</span>
                  </a>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => setPokemonPage(p => Math.max(0, p - 1))}
                    disabled={pokemonPage === 0}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-sm font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Prev
                  </button>
                  <span className="text-xs font-bold text-slate-500">
                    Page {pokemonPage + 1} / {totalPages} · Showing {pokemonPage * PAGE_SIZE + 1}–{Math.min((pokemonPage + 1) * PAGE_SIZE, selectedData.count)} of {selectedData.count}
                  </span>
                  <button
                    onClick={() => setPokemonPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={pokemonPage >= totalPages - 1}
                    className="px-4 py-2 rounded-xl text-sm font-black text-white hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    style={{ backgroundColor: TYPE_COLORS[activeType] }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-8 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-black text-slate-600 mb-2">Select a Type</h3>
              <p className="text-sm text-slate-400">Click any slice on the wheel or a type pill to explore Pokémon of that type</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
