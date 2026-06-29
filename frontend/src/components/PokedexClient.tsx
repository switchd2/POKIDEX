'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { PokemonBase, getArtworkUrl, getGeneration } from '@/lib/pokedex-utils';
import { PokemonCard } from './PokemonCard';

const TYPE_COLORS: Record<string, string> = {
  fire: '#ef8834', water: '#4d90d5', grass: '#63bb5b',
  poison: '#ab6ac8', flying: '#89aae3', electric: '#f4d23c',
  psychic: '#f97176', dragon: '#0a6dc4', ghost: '#5269ad',
  normal: '#9198a1', ice: '#74cec0', fighting: '#ce4069',
  rock: '#c5b78c', ground: '#d97746', bug: '#90c12c',
  steel: '#5a8ea2', fairy: '#ec8fe6', dark: '#5a5366',
};

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

interface PokedexClientProps {
  initialList: PokemonBase[];
}

interface DetailStats {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  stats: { name: string; value: number }[];
  flavorText: string;
  catchRate: number;
  genderRate: number;
}

export default function PokedexClient({ initialList }: PokedexClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedGen, setSelectedGen] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(60);

  // Modal State
  const [activeId, setActiveId] = useState<number | null>(null);
  const [modalDetails, setModalDetails] = useState<DetailStats | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'stats'>('about');

  // Types list for filters
  const typesList = useMemo(() => {
    return Object.keys(TYPE_COLORS);
  }, []);

  // Filtered List
  const filteredList = useMemo(() => {
    return initialList.filter((pokemon) => {
      // 1. Search Query (matches ID or Name)
      const matchesSearch =
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pokemon.id.toString() === searchQuery.trim();

      // 2. Type Filter
      const matchesType =
        selectedType === 'all' ||
        pokemon.types.some((t) => t.toLowerCase() === selectedType.toLowerCase());

      // 3. Gen Filter
      const matchesGen =
        selectedGen === 'all' ||
        getGeneration(pokemon.id).toString() === selectedGen;

      return matchesSearch && matchesType && matchesGen;
    });
  }, [initialList, searchQuery, selectedType, selectedGen]);

  // Dynamic visible list
  const visibleList = useMemo(() => {
    return filteredList.slice(0, visibleCount);
  }, [filteredList, visibleCount]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(60);
  }, [searchQuery, selectedType, selectedGen]);

  // Fetch details when modal opens
  useEffect(() => {
    if (!activeId) {
      setModalDetails(null);
      return;
    }

    const fetchDetails = async () => {
      setLoadingDetails(true);
      setErrorDetails(null);
      setActiveTab('about'); // Reset tab when opening new modal
      try {
        const [res, speciesRes] = await Promise.all([
          fetch(`https://pokeapi.co/api/v2/pokemon/${activeId}`),
          fetch(`https://pokeapi.co/api/v2/pokemon-species/${activeId}`)
        ]);
        if (!res.ok || !speciesRes.ok) throw new Error('Failed to fetch Pokémon details');
        
        const data = await res.json();
        const speciesData = await speciesRes.json();
        
        const flavorEntry = speciesData.flavor_text_entries.find((f: any) => f.language.name === 'en');
        const flavorText = flavorEntry ? flavorEntry.flavor_text.replace(/[\n\f]/g, ' ') : 'No description available.';

        setModalDetails({
          id: data.id,
          name: data.name,
          height: data.height / 10, // decimeters to meters
          weight: data.weight / 10, // hectograms to kg
          types: data.types.map((t: any) => t.type.name),
          abilities: data.abilities.map((a: any) => a.ability.name),
          stats: data.stats.map((s: any) => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
          flavorText,
          catchRate: speciesData.capture_rate,
          genderRate: speciesData.gender_rate,
        });
      } catch (err: any) {
        setErrorDetails(err.message || 'An error occurred');
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [activeId]);

  // Close modal on escape keypress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="container-wide py-12">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-xs uppercase tracking-[0.6em] font-black text-red-500 mb-2">Database</h1>
        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight text-slate-800">
          National Pokédex
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Discover, search, and analyze all {initialList.length} Pokémon from Generations 1 to 9.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name or Pokédex number (e.g. pikachu or 25)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Gen Selector */}
          <div>
            <select
              value={selectedGen}
              onChange={(e) => setSelectedGen(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.25em',
              }}
            >
              <option value="all">All Generations (1–9)</option>
              <option value="1">Gen 1 (Kanto)</option>
              <option value="2">Gen 2 (Johto)</option>
              <option value="3">Gen 3 (Hoenn)</option>
              <option value="4">Gen 4 (Sinnoh)</option>
              <option value="5">Gen 5 (Unova)</option>
              <option value="6">Gen 6 (Kalos)</option>
              <option value="7">Gen 7 (Alola)</option>
              <option value="8">Gen 8 (Galar)</option>
              <option value="9">Gen 9 (Paldea)</option>
            </select>
          </div>
        </div>

        {/* Type Filter row */}
        <div>
          <span className="block text-xs uppercase tracking-wider font-bold text-slate-500 mb-3">
            Filter by Type
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all hover:scale-105 ${
                selectedType === 'all'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              All Types
            </button>
            {typesList.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all hover:scale-105`}
                style={{
                  backgroundColor: selectedType === type ? TYPE_COLORS[type] : '#fff',
                  color: selectedType === type ? '#fff' : TYPE_COLORS[type],
                  border: selectedType === type ? '1px solid transparent' : `1px solid ${TYPE_COLORS[type]}40`,
                  boxShadow: selectedType === type ? `0 4px 12px ${TYPE_COLORS[type]}30` : 'none',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Results info */}
      <div className="flex justify-between items-center mb-6 px-2">
        <span className="text-sm font-semibold text-slate-500">
          Showing {Math.min(filteredList.length, visibleCount)} of {filteredList.length} Pokémon
        </span>
        {filteredList.length === 0 && (
          <span className="text-sm text-red-500 font-medium">No matches found</span>
        )}
      </div>

      {/* Pokémon Grid */}
      <div className="pokemon-grid">
        {visibleList.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={() => setActiveId(pokemon.id)}
          />
        ))}
      </div>

      {/* Show More Pagination */}
      {filteredList.length > visibleCount && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + 60)}
            className="px-8 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-colors shadow-lg hover:scale-105 transform transition-transform"
          >
            Show More Pokémon
          </button>
        </div>
      )}

      {/* Dynamic Detail Modal */}
      {activeId !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setActiveId(null)}
        >
          <div 
            className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveId(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
            >
              ✕
            </button>

            {loadingDetails && (
              <div className="flex flex-col items-center justify-center py-24 min-h-[400px]">
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-500 font-semibold mt-4">Loading stats...</p>
              </div>
            )}

            {errorDetails && (
              <div className="flex flex-col items-center justify-center py-24 min-h-[400px]">
                <span className="text-3xl">⚠️</span>
                <p className="text-red-500 font-bold mt-2">{errorDetails}</p>
                <button
                  onClick={() => setActiveId(activeId)}
                  className="mt-4 px-4 py-2 bg-slate-100 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loadingDetails && !errorDetails && modalDetails && (
              <>
                {/* Modal Top Banner (themed based on primary type) */}
                <div 
                  className="relative p-8 pb-12 text-white flex flex-col items-center text-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${
                      TYPE_COLORS[modalDetails.types[0]?.toLowerCase()] || '#888'
                    }ee, ${
                      TYPE_COLORS[modalDetails.types[1]?.toLowerCase()] || TYPE_COLORS[modalDetails.types[0]?.toLowerCase()] || '#888'
                    }dd)`,
                  }}
                >
                  <div className="relative w-40 h-40 flex-shrink-0 bg-white/20 rounded-full p-4 flex items-center justify-center shadow-inner mb-4">
                    <Image
                      src={getArtworkUrl(modalDetails.id)}
                      alt={modalDetails.name}
                      width={160}
                      height={160}
                      priority
                      className="object-contain drop-shadow-xl z-10 hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <span className="font-mono text-white/80 font-bold tracking-widest text-sm">
                    #{String(modalDetails.id).padStart(4, '0')}
                  </span>
                  <h2 className="text-4xl font-black uppercase tracking-tight capitalize mt-1 drop-shadow-md">
                    {modalDetails.name}
                  </h2>
                  <div className="flex justify-center gap-2 mt-3">
                    {modalDetails.types.map(t => (
                      <span 
                        key={t}
                        className="px-4 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 shrink-0">
                  <button 
                    onClick={() => setActiveTab('about')}
                    className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors border-b-2 ${
                      activeTab === 'about' ? 'text-slate-800 border-slate-800' : 'text-slate-400 border-transparent hover:text-slate-600'
                    }`}
                  >
                    About
                  </button>
                  <button 
                    onClick={() => setActiveTab('stats')}
                    className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors border-b-2 ${
                      activeTab === 'stats' ? 'text-slate-800 border-slate-800' : 'text-slate-400 border-transparent hover:text-slate-600'
                    }`}
                  >
                    Stats
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
                  
                  {activeTab === 'about' && (
                    <div className="space-y-6 animate-fade-in">
                      <p className="text-sm text-slate-600 leading-relaxed text-center italic px-4">
                        "{modalDetails.flavorText}"
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                          <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Height</span>
                          <span className="text-lg font-bold text-slate-800">{modalDetails.height}m</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                          <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Weight</span>
                          <span className="text-lg font-bold text-slate-800">{modalDetails.weight}kg</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3 text-center">Abilities</h4>
                        <div className="flex flex-wrap justify-center gap-2">
                          {modalDetails.abilities.map(a => (
                            <span 
                              key={a}
                              className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 capitalize"
                            >
                              {a.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                             <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 text-center">Catch Rate</span>
                             <div className="text-center font-bold text-slate-700">{modalDetails.catchRate}</div>
                           </div>
                           <div>
                             <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 text-center">Gender</span>
                             <div className="text-center font-bold text-slate-700 text-sm flex justify-center gap-2">
                               {modalDetails.genderRate === -1 ? (
                                 <span className="text-slate-500">Genderless</span>
                               ) : (
                                 <>
                                   <span className="text-blue-500">♂ {((8 - modalDetails.genderRate) / 8 * 100).toFixed(1)}%</span>
                                   <span className="text-pink-500">♀ {(modalDetails.genderRate / 8 * 100).toFixed(1)}%</span>
                                 </>
                               )}
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'stats' && (
                    <div className="space-y-4 animate-fade-in">
                      {modalDetails.stats.map((s) => {
                        const maxVal = 255;
                        const percentage = (s.value / maxVal) * 100;
                        const statColor = TYPE_COLORS[modalDetails.types[0]?.toLowerCase()] || '#FF3B3B';

                        return (
                          <div key={s.name} className="flex items-center">
                            <span className="w-20 text-xs font-bold text-slate-500 capitalize">
                              {STAT_LABELS[s.name] || s.name}
                            </span>
                            <span className="w-10 text-xs font-extrabold text-slate-800 text-right pr-3">
                              {s.value}
                            </span>
                            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: statColor,
                                  boxShadow: `0 0 8px ${statColor}40`,
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="pt-4 border-t border-slate-100 flex items-center">
                         <span className="w-20 text-xs font-black text-slate-700 uppercase tracking-wider">Total</span>
                         <span className="w-10 text-xs font-black text-slate-800 text-right pr-3">
                           {modalDetails.stats.reduce((acc, s) => acc + s.value, 0)}
                         </span>
                         <div className="flex-1"></div>
                      </div>
                    </div>
                  )}

                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
