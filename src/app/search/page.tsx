"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Fuse from "fuse.js";
import { getPokemonList } from "@/lib/pokeapi";

interface SearchResult {
  id: number;
  name: string;
  sprite: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [pokemon, setPokemon] = useState<SearchResult[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all Pokémon
  useEffect(() => {
    const loadPokemon = async () => {
      try {
        const list = await getPokemonList(1025, 0);
        const data = list.results.map((p, index) => ({
          id: index + 1,
          name: p.name,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/${index + 1}.png`,
        }));
        setPokemon(data);
      } catch (error) {
        console.error("Error loading Pokémon:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, []);

  // Initialize Fuse and search
  const fuse = useMemo(
    () =>
      new Fuse(pokemon, {
        keys: ["name"],
        threshold: 0.3,
      }),
    [pokemon]
  );

  const searchResults = useMemo(() => {
    if (!query.trim()) return pokemon.slice(0, 20);
    return fuse.search(query).map((result) => result.item);
  }, [query, fuse, pokemon]);

  useEffect(() => {
    setResults(searchResults);
  }, [searchResults]);

  return (
    <div className="w-full bg-white">
      <main className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="mb-4 text-5xl font-bold uppercase tracking-tight md:text-6xl"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            SEARCH
          </h1>

          {/* Search Input */}
          <div className="mt-8 border border-black">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH POKÉMON BY NAME..."
              className="w-full bg-white px-4 py-3 font-mono text-lg outline-none placeholder-gray-400"
              autoFocus
            />
          </div>

          {!loading && (
            <p className="mt-4 font-mono text-sm text-gray-600">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center">
            <p className="font-mono text-gray-500">Loading Pokémon...</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border border-black">
            {results.map((p, index) => (
              <Link
                key={p.name}
                href={`/pokemon/${p.name}`}
                className={`group border-r border-b border-black p-4 hover:bg-black hover:text-white transition-colors last:border-r-0 ${
                  (index + 1) % 4 === 0 ? "lg:border-r-0" : ""
                } ${(index + 1) % 3 === 0 ? "sm:border-r-0 lg:border-r" : ""}`}
              >
                <div className="mb-3 h-24 bg-gray-50 group-hover:bg-gray-800 border border-black flex items-center justify-center">
                  <img
                    src={p.sprite}
                    alt={p.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="mb-1 font-mono text-xs text-gray-500 group-hover:text-gray-300">
                  #{String(p.id).padStart(4, "0")}
                </div>
                <div className="font-mono text-sm font-bold uppercase">
                  {p.name}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && query.trim() && (
          <div className="py-12 text-center border border-black p-8">
            <p className="font-mono text-gray-500">No Pokémon found matching "{query}"</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-black bg-gray-50 px-6 py-8 text-center md:px-12">
        <p className="font-mono text-xs text-gray-600">
          PokéWiki © 2024 · Data from{" "}
          <a
            href="https://pokeapi.co"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-black"
          >
            PokéAPI
          </a>
        </p>
      </footer>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center font-mono text-gray-500">Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
