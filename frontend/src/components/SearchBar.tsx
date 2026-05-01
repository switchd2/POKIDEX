'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SearchItem {
  name: string;
  id: number | string;
  type: 'pokemon' | 'type' | 'generation';
}

interface SearchBarProps {
  items?: SearchItem[];
  autoFocus?: boolean;
}

export default function SearchBar({ items = [], autoFocus = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchItem[]>([]);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const filtered = items.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, items]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/pokedex?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="absolute left-4 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          autoFocus={autoFocus}
          placeholder="SEARCH BY NAME, ID, OR TYPE..."
          className="w-full border border-black py-4 pl-12 pr-4 font-mono text-sm uppercase tracking-wider outline-none focus:bg-gray-50"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-16 text-gray-400 hover:text-black"
          >
            <X size={20} />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-0 flex h-full items-center border-l border-black bg-black px-4 text-white transition-colors hover:bg-gray-800"
        >
          <ArrowRight size={20} />
        </button>
      </form>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full z-50 mt-1 w-full border border-black bg-white shadow-xl">
          {results.map((item, index) => (
            <button
              key={`${item.type}-${item.id}`}
              onClick={() => {
                router.push(`/pokemon/${item.name.toLowerCase()}`);
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-4 py-3 text-left font-mono text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors",
                index !== results.length - 1 && "border-b border-gray-100"
              )}
            >
              <span>{item.name}</span>
              <span className="text-[10px] opacity-50">#{String(item.id).padStart(4, '0')}</span>
            </button>
          ))}
          <button
            onClick={handleSearch}
            className="flex w-full items-center justify-center bg-gray-50 py-2 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-gray-100"
          >
            View all results for "{query}"
          </button>
        </div>
      )}
    </div>
  );
}
