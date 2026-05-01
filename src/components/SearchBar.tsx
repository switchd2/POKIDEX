"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import Link from "next/link";

interface SearchResult {
  name: string;
  id: number;
  type: "pokemon" | "move" | "ability";
}

interface SearchBarProps {
  items: SearchResult[];
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  items,
  placeholder = "SEARCH POKÉMON, MOVES, ABILITIES...",
  autoFocus = true,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Initialize Fuse.js
  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["name"],
        threshold: 0.3,
        includeScore: true,
      }),
    [items]
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 10).map((result) => result.item);
  }, [query, fuse]);

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative flex items-center border border-black">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-white px-4 py-3 font-mono text-sm outline-none placeholder-gray-400"
        />
        <span className="pr-4 font-bold text-gray-400">→</span>
      </div>

      {/* Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-10 border-l border-r border-b border-black bg-white">
          {results.map((result) => (
            <Link
              key={`${result.type}-${result.name}`}
              href={
                result.type === "pokemon"
                  ? `/pokemon/${result.name}`
                  : `/search?q=${result.name}`
              }
              className="block border-b border-black px-4 py-3 font-mono text-sm hover:bg-black hover:text-white transition-colors last:border-b-0"
              onClick={() => setShowResults(false)}
            >
              <span className="mr-2 uppercase font-bold">{result.name}</span>
              <span className="text-xs text-gray-400">({result.type})</span>
            </Link>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showResults && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-10 border-l border-r border-b border-black bg-white">
          <div className="px-4 py-3 font-mono text-sm text-gray-500">
            No results found
          </div>
        </div>
      )}
    </div>
  );
}
