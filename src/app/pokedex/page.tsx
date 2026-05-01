"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPokemonList } from "@/lib/pokeapi";

interface Pokemon {
  id: number;
  name: string;
  sprite: string;
}

const GENERATIONS = [
  { id: "all", name: "ALL", range: [1, 1025] },
  { id: "1", name: "I", range: [1, 151] },
  { id: "2", name: "II", range: [152, 251] },
  { id: "3", name: "III", range: [252, 386] },
  { id: "4", name: "IV", range: [387, 493] },
  { id: "5", name: "V", range: [494, 649] },
  { id: "6", name: "VI", range: [650, 721] },
  { id: "7", name: "VII", range: [722, 809] },
  { id: "8", name: "VIII", range: [810, 905] },
  { id: "9", name: "IX", range: [906, 1025] },
];

const TYPES = [
  "all",
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export default function Pokedex() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [generation, setGeneration] = useState("all");
  const [sort, setSort] = useState<"name" | "number">("number");

  useEffect(() => {
    const loadPokemon = async () => {
      setLoading(true);
      try {
        const result = await getPokemonList(1025, 0);
        const pokemonData: Pokemon[] = result.results
          .map((p, index) => ({
            id: index + 1,
            name: p.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/${index + 1}.png`,
          }))
          .sort((a, b) => {
            if (sort === "name") {
              return a.name.localeCompare(b.name);
            }
            return a.id - b.id;
          });

        // Filter by generation
        const gen = GENERATIONS.find((g) => g.id === generation);
        if (gen && generation !== "all") {
          const [min, max] = gen.range;
          const filtered = pokemonData.filter(
            (p) => p.id >= min && p.id <= max
          );
          setPokemon(filtered);
        } else {
          setPokemon(pokemonData);
        }
      } catch (error) {
        console.error("Error loading Pokémon:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, [generation, sort]);

  return (
    <div className="min-h-screen w-full bg-white">

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        {/* Header */}
        <div className="mb-12 border-b border-black pb-8">
          <h1
            className="mb-2 text-5xl font-bold uppercase tracking-tight md:text-6xl"
            style={{ fontFamily: "Bebas Neue, sans-serif" }}
          >
            POKÉDEX
          </h1>
          <p className="font-mono text-sm text-gray-600">
            {pokemon.length} Pokémon found
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 border-b border-black pb-8">
          {/* Generation Filter */}
          <div>
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-gray-600">
              Generation
            </p>
            <div className="flex flex-wrap gap-2">
              {GENERATIONS.map((gen) => (
                <button
                  key={gen.id}
                  onClick={() => setGeneration(gen.id)}
                  className={`border border-black px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                    generation === gen.id
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {gen.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-gray-600">
              Sort
            </p>
            <div className="flex gap-2">
              {(["number", "name"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setSort(option)}
                  className={`border border-black px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                    sort === option
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {option === "number" ? "NUMBER" : "NAME"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center">
            <p className="font-mono text-gray-500">Loading Pokédex...</p>
          </div>
        )}

        {/* Pokémon Grid */}
        {!loading && pokemon.length > 0 && (
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
            {pokemon.map((p, index) => (
              <Link
                key={p.name}
                href={`/pokemon/${p.name}`}
                className={`group border border-black p-4 hover:bg-black hover:text-white transition-colors ${
                  index % 2 === 0 ? "lg:border-r-0" : ""
                } ${index < pokemon.length - (pokemon.length % 2 || 2) ? "lg:border-b-0" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-mono text-xs text-gray-500 group-hover:text-gray-300 mb-1">
                      #{String(p.id).padStart(4, "0")}
                    </div>
                    <div className="font-mono text-sm font-bold uppercase">
                      {p.name}
                    </div>
                  </div>
                  <div className="h-16 w-16 flex-shrink-0 bg-gray-50 group-hover:bg-gray-800 border border-black flex items-center justify-center">
                    <img
                      src={p.sprite}
                      alt={p.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && pokemon.length === 0 && (
          <div className="py-12 text-center">
            <p className="font-mono text-gray-500">No Pokémon found</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-black bg-gray-50 px-6 py-8 text-center md:px-12">
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
