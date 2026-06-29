'use client';

import { useState } from 'react';

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

// TYPE_CHART[attackingType][defendingType] = multiplier
const TYPE_CHART: Record<PokemonType, Record<PokemonType, number>> = {
  normal:   { normal:1, fire:1, water:1, electric:1, grass:1, ice:1, fighting:1, poison:1, ground:1, flying:1, psychic:1, bug:1, rock:0.5, ghost:0, dragon:1, dark:1, steel:0.5, fairy:1 },
  fire:     { normal:1, fire:0.5, water:0.5, electric:1, grass:2, ice:2, fighting:1, poison:1, ground:1, flying:1, psychic:1, bug:2, rock:0.5, ghost:1, dragon:0.5, dark:1, steel:2, fairy:1 },
  water:    { normal:1, fire:2, water:0.5, electric:1, grass:0.5, ice:1, fighting:1, poison:1, ground:2, flying:1, psychic:1, bug:1, rock:2, ghost:1, dragon:0.5, dark:1, steel:1, fairy:1 },
  electric: { normal:1, fire:1, water:2, electric:0.5, grass:0.5, ice:1, fighting:1, poison:1, ground:0, flying:2, psychic:1, bug:1, rock:1, ghost:1, dragon:0.5, dark:1, steel:1, fairy:1 },
  grass:    { normal:1, fire:0.5, water:2, electric:1, grass:0.5, ice:1, fighting:1, poison:0.5, ground:2, flying:0.5, psychic:1, bug:0.5, rock:2, ghost:1, dragon:0.5, dark:1, steel:0.5, fairy:1 },
  ice:      { normal:1, fire:0.5, water:0.5, electric:1, grass:2, ice:0.5, fighting:1, poison:1, ground:2, flying:2, psychic:1, bug:1, rock:1, ghost:1, dragon:2, dark:1, steel:0.5, fairy:1 },
  fighting: { normal:2, fire:1, water:1, electric:1, grass:1, ice:2, fighting:1, poison:0.5, ground:1, flying:0.5, psychic:0.5, bug:0.5, rock:2, ghost:0, dragon:1, dark:2, steel:2, fairy:0.5 },
  poison:   { normal:1, fire:1, water:1, electric:1, grass:2, ice:1, fighting:1, poison:0.5, ground:0.5, flying:1, psychic:1, bug:1, rock:0.5, ghost:0.5, dragon:1, dark:1, steel:0, fairy:2 },
  ground:   { normal:1, fire:2, water:1, electric:2, grass:0.5, ice:1, fighting:1, poison:2, ground:1, flying:0, psychic:1, bug:0.5, rock:2, ghost:1, dragon:1, dark:1, steel:2, fairy:1 },
  flying:   { normal:1, fire:1, water:1, electric:0.5, grass:2, ice:1, fighting:2, poison:1, ground:1, flying:1, psychic:1, bug:2, rock:0.5, ghost:1, dragon:1, dark:1, steel:0.5, fairy:1 },
  psychic:  { normal:1, fire:1, water:1, electric:1, grass:1, ice:1, fighting:2, poison:2, ground:1, flying:1, psychic:0.5, bug:1, rock:1, ghost:1, dragon:1, dark:0, steel:0.5, fairy:1 },
  bug:      { normal:1, fire:0.5, water:1, electric:1, grass:2, ice:1, fighting:0.5, poison:0.5, ground:1, flying:0.5, psychic:2, bug:1, rock:1, ghost:0.5, dragon:1, dark:2, steel:0.5, fairy:0.5 },
  rock:     { normal:1, fire:2, water:1, electric:1, grass:1, ice:2, fighting:0.5, poison:1, ground:0.5, flying:2, psychic:1, bug:2, rock:1, ghost:1, dragon:1, dark:1, steel:0.5, fairy:1 },
  ghost:    { normal:0, fire:1, water:1, electric:1, grass:1, ice:1, fighting:1, poison:1, ground:1, flying:1, psychic:2, bug:1, rock:1, ghost:2, dragon:1, dark:0.5, steel:1, fairy:1 },
  dragon:   { normal:1, fire:1, water:1, electric:1, grass:1, ice:1, fighting:1, poison:1, ground:1, flying:1, psychic:1, bug:1, rock:1, ghost:1, dragon:2, dark:1, steel:0.5, fairy:0 },
  dark:     { normal:1, fire:1, water:1, electric:1, grass:1, ice:1, fighting:0.5, poison:1, ground:1, flying:1, psychic:2, bug:1, rock:1, ghost:2, dragon:1, dark:0.5, steel:0.5, fairy:0.5 },
  steel:    { normal:1, fire:0.5, water:0.5, electric:0.5, grass:1, ice:2, fighting:1, poison:1, ground:1, flying:1, psychic:1, bug:1, rock:2, ghost:1, dragon:1, dark:1, steel:0.5, fairy:2 },
  fairy:    { normal:1, fire:0.5, water:1, electric:1, grass:1, ice:1, fighting:2, poison:0.5, ground:1, flying:1, psychic:1, bug:1, rock:1, ghost:1, dragon:2, dark:2, steel:0.5, fairy:1 },
};

function getCellStyle(multiplier: number, isHighlighted: boolean) {
  if (multiplier === 0)   return { bg: isHighlighted ? '#1e1e2e' : '#2d2d3d', text: '#666', label: '0' };
  if (multiplier === 0.5) return { bg: isHighlighted ? '#7f1d1d' : '#fce7e7', text: isHighlighted ? '#fca5a5' : '#c0392b', label: '½' };
  if (multiplier === 2)   return { bg: isHighlighted ? '#14532d' : '#dcfce7', text: isHighlighted ? '#86efac' : '#15803d', label: '2' };
  return { bg: isHighlighted ? '#374151' : '#f8fafc', text: isHighlighted ? '#9ca3af' : '#64748b', label: '1' };
}

function TypePill({ type }: { type: PokemonType }) {
  return (
    <div
      className="w-full text-center text-[8px] sm:text-[10px] font-black uppercase tracking-wide py-1 rounded-md truncate"
      style={{ backgroundColor: TYPE_COLORS[type], color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
    >
      {type}
    </div>
  );
}

export default function TypeMatchupMatrix() {
  const [selectedAttack, setSelectedAttack] = useState<PokemonType | null>(null);
  const [selectedDefend, setSelectedDefend] = useState<PokemonType | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ atk: PokemonType; def: PokemonType } | null>(null);

  const getMultiplier = (atk: PokemonType, def: PokemonType) => TYPE_CHART[atk][def];

  const highlightedAtk = hoveredCell?.atk ?? selectedAttack;
  const highlightedDef = hoveredCell?.def ?? selectedDefend;

  const summaryMult = selectedAttack && selectedDefend ? getMultiplier(selectedAttack, selectedDefend) : null;

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        {[
          { label: '2× Super Effective', bg: '#dcfce7', text: '#15803d' },
          { label: '½× Not Very Effective', bg: '#fce7e7', text: '#c0392b' },
          { label: '0× No Effect', bg: '#2d2d3d', text: '#888' },
          { label: '1× Normal', bg: '#f8fafc', text: '#64748b' },
        ].map(({ label, bg, text }) => (
          <div key={label} className="flex items-center gap-2 text-xs font-semibold">
            <div className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center font-black text-xs" style={{ backgroundColor: bg, color: text }}>
              {label.split('×')[0]}
            </div>
            <span className="text-slate-500 text-[11px]">{label}</span>
          </div>
        ))}
      </div>

      {/* Selection Summary */}
      {selectedAttack && selectedDefend && summaryMult !== null && (
        <div className="mb-5 p-4 rounded-2xl border-2 flex items-center gap-4 animate-fade-in"
          style={{ borderColor: summaryMult === 2 ? '#86efac' : summaryMult === 0 ? '#475569' : summaryMult === 0.5 ? '#fca5a5' : '#e2e8f0', background: summaryMult === 2 ? '#f0fdf4' : summaryMult === 0 ? '#1e293b' : summaryMult === 0.5 ? '#fff1f2' : '#f8fafc' }}
        >
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full text-xs font-black text-white uppercase" style={{ backgroundColor: TYPE_COLORS[selectedAttack] }}>{selectedAttack}</div>
            <span className="text-slate-400 font-bold">→</span>
            <div className="px-3 py-1 rounded-full text-xs font-black text-white uppercase" style={{ backgroundColor: TYPE_COLORS[selectedDefend] }}>{selectedDefend}</div>
          </div>
          <div className="text-2xl font-black" style={{ color: summaryMult === 2 ? '#15803d' : summaryMult === 0 ? '#94a3b8' : summaryMult === 0.5 ? '#c0392b' : '#64748b' }}>
            {summaryMult}×
          </div>
          <div className="text-sm font-semibold" style={{ color: summaryMult === 2 ? '#16a34a' : summaryMult === 0 ? '#94a3b8' : summaryMult === 0.5 ? '#dc2626' : '#64748b' }}>
            {summaryMult === 2 ? 'Super Effective!' : summaryMult === 0 ? 'No Effect' : summaryMult === 0.5 ? 'Not Very Effective' : 'Normal Damage'}
          </div>
          <button onClick={() => { setSelectedAttack(null); setSelectedDefend(null); }} className="ml-auto text-xs text-slate-400 hover:text-slate-600 font-bold px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">Clear</button>
        </div>
      )}

      {/* Instructions */}
      <p className="text-xs text-slate-400 mb-4 font-medium">
        <span className="font-bold text-slate-600">Row = Attacking type · Column = Defending type.</span> Click a cell to pin it. Hover to preview.
      </p>

      {/* Matrix Table - Scrollable on mobile */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
        <table className="border-collapse" style={{ minWidth: '600px' }}>
          <thead>
            <tr>
              {/* Corner */}
              <th className="sticky left-0 z-20 bg-slate-800 w-[80px] min-w-[80px] p-1">
                <div className="text-[8px] text-slate-400 text-center leading-tight font-bold">
                  ATK<br />↓ DEF→
                </div>
              </th>
              {TYPES.map(def => (
                <th key={def} className="p-1 w-[38px] min-w-[38px]"
                  style={{ backgroundColor: highlightedDef === def ? `${TYPE_COLORS[def]}33` : '#f8fafc' }}
                >
                  <div
                    className="w-full text-[7px] sm:text-[9px] font-black uppercase py-1 px-0.5 rounded-md text-white cursor-pointer select-none hover:opacity-80 transition-opacity truncate text-center"
                    style={{ backgroundColor: TYPE_COLORS[def], textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                    onClick={() => setSelectedDefend(def === selectedDefend ? null : def)}
                    title={`Defend: ${def}`}
                  >
                    {def.slice(0, 3)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TYPES.map(atk => (
              <tr key={atk}
                style={{ backgroundColor: highlightedAtk === atk ? `${TYPE_COLORS[atk]}11` : 'transparent' }}
              >
                {/* Row header */}
                <th className="sticky left-0 z-10 p-1" style={{ backgroundColor: highlightedAtk === atk ? `${TYPE_COLORS[atk]}22` : '#f8fafc' }}>
                  <div
                    className="w-full text-[7px] sm:text-[9px] font-black uppercase py-1 px-1 rounded-md text-white cursor-pointer select-none hover:opacity-80 transition-opacity truncate text-center"
                    style={{ backgroundColor: TYPE_COLORS[atk], textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                    onClick={() => setSelectedAttack(atk === selectedAttack ? null : atk)}
                    title={`Attack: ${atk}`}
                  >
                    {atk.slice(0, 3)}
                  </div>
                </th>
                {/* Cells */}
                {TYPES.map(def => {
                  const mult = getMultiplier(atk, def);
                  const isRowHL = highlightedAtk === atk;
                  const isColHL = highlightedDef === def;
                  const isHovered = hoveredCell?.atk === atk && hoveredCell?.def === def;
                  const isPinned = selectedAttack === atk && selectedDefend === def;
                  const cell = getCellStyle(mult, (isRowHL || isColHL));

                  return (
                    <td key={def}
                      className="p-0.5 cursor-pointer"
                      onMouseEnter={() => setHoveredCell({ atk, def })}
                      onMouseLeave={() => setHoveredCell(null)}
                      onClick={() => {
                        setSelectedAttack(atk);
                        setSelectedDefend(def);
                      }}
                    >
                      <div
                        className={`w-[34px] h-[26px] sm:w-[36px] sm:h-[28px] rounded flex items-center justify-center text-[10px] sm:text-xs font-black transition-all duration-150 ${isPinned ? 'ring-2 ring-blue-400 scale-110 z-10 relative' : ''} ${isHovered ? 'scale-105 z-10 relative shadow-md' : ''}`}
                        style={{ backgroundColor: cell.bg, color: cell.text }}
                        title={`${atk} → ${def}: ${mult}×`}
                      >
                        {cell.label}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Type Attack Summary */}
      {selectedAttack && (
        <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-4 py-1.5 rounded-full text-sm font-black text-white uppercase" style={{ backgroundColor: TYPE_COLORS[selectedAttack] }}>
              {selectedAttack}
            </div>
            <span className="text-sm font-bold text-slate-600">Attack Effectiveness</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: '⚡ Super Effective (2×)', mult: 2, color: '#15803d', bg: '#dcfce7' },
              { label: '👎 Not Very Effective (½×)', mult: 0.5, color: '#c0392b', bg: '#fce7e7' },
              { label: '🚫 No Effect (0×)', mult: 0, color: '#64748b', bg: '#f1f5f9' },
            ].map(({ label, mult, color, bg }) => {
              const targets = TYPES.filter(def => getMultiplier(selectedAttack, def) === mult);
              return (
                <div key={mult} className="p-3 rounded-xl" style={{ backgroundColor: bg }}>
                  <div className="text-[11px] font-bold mb-2" style={{ color }}>{label}</div>
                  <div className="flex flex-wrap gap-1">
                    {targets.length === 0 ? (
                      <span className="text-[11px] text-slate-400">None</span>
                    ) : targets.map(t => (
                      <span key={t} className="text-[10px] font-black text-white px-2 py-0.5 rounded-full uppercase" style={{ backgroundColor: TYPE_COLORS[t] }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
