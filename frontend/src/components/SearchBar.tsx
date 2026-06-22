'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { searchPokemon } from '@/lib/api';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search logic
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchPokemon(query);
        setResults(data);
        setIsOpen(data.length > 0);
        setActiveIndex(-1);
      } catch (e) {
        console.error("Failed to search pokemon", e);
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Click outside detection to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && activeIndex < results.length) {
      handleSelectPokemon(results[activeIndex]);
    } else if (query.trim()) {
      router.push(`/pages/pokedex?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleSelectPokemon = (poke: any) => {
    setQuery('');
    setIsOpen(false);
    if (poke.type === 'pokemon') {
      router.push(`/pages/pokemon/${poke.slug}`);
    } else {
      router.push(`/pages/pokedex?search=${encodeURIComponent(poke.name)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1 < results.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative" ref={dropdownRef}>
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <div className="absolute left-5 text-[var(--text-muted)] pointer-events-none">
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-[var(--accent-red)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search by name, ID, or type..."
          className="w-full bg-[var(--bg-card)] border-2 border-[var(--border)] focus:border-[var(--accent-red)] rounded-2xl py-5 pl-14 pr-16 font-sans text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all focus:shadow-md"
        />
        <button
          type="submit"
          className="absolute right-4 flex items-center justify-center bg-[var(--accent-red)] w-11 h-11 rounded-xl text-white hover:opacity-90 transition-opacity shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </form>

      {/* Autocomplete dropdown overlay */}
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-3 bg-white border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden z-50 animate-fade-in max-h-[420px] overflow-y-auto">
          <div className="py-2">
            {results.map((poke, index) => {
              const isPokemon = poke.type === 'pokemon';
              const imageUrl = isPokemon
                ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.nationalDex}.png`
                : null;

              return (
                <div
                  key={poke.id || poke.name}
                  onClick={() => handleSelectPokemon(poke)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex items-center justify-between px-6 py-4 cursor-pointer border-b border-[var(--border)] last:border-b-0 transition-colors ${
                    index === activeIndex ? 'bg-slate-100/70' : 'bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {isPokemon && imageUrl && (
                      <div className="w-12 h-12 flex-shrink-0 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100">
                        <Image
                          src={imageUrl}
                          alt={poke.name}
                          width={40}
                          height={40}
                          loading="lazy"
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                    )}
                    <div>
                      {isPokemon && (
                        <span className="mono text-[10px] font-bold text-[var(--text-muted)] tracking-wider">
                          #{String(poke.nationalDex).padStart(4, '0')}
                        </span>
                      )}
                      <h4 className="text-base font-bold text-[var(--text-primary)] capitalize leading-tight">
                        {poke.name}
                      </h4>
                      {!isPokemon && (
                        <span className="text-[10px] uppercase font-semibold text-[var(--text-secondary)] tracking-widest">
                          {poke.type}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    {poke.types?.map((t: string) => (
                      <span
                        key={t}
                        className={`type-badge type-${t.toLowerCase()} text-[9px] px-2.5 py-1 font-extrabold rounded-full uppercase tracking-wider`}
                      >
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
