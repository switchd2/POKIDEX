"use client";

import Link from "next/link";
import { useState } from "react";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-widest"
          style={{ fontFamily: "Bebas Neue, sans-serif" }}
        >
          POKÉWIKI
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden gap-8 md:flex">
          <Link
            href="/pokedex"
            className="border border-black px-4 py-2 font-mono text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
          >
            POKÉDEX
          </Link>
          <Link
            href="/history"
            className="border border-black px-4 py-2 font-mono text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
          >
            HISTORY
          </Link>
          <Link
            href="/types"
            className="border border-black px-4 py-2 font-mono text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
          >
            TYPES
          </Link>
          <Link
            href="/generations"
            className="border border-black px-4 py-2 font-mono text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
          >
            GENERATIONS
          </Link>
          <Link
            href="/search"
            className="border border-black px-4 py-2 font-mono text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
          >
            SEARCH →
          </Link>
        </div>

        {/* Hamburger Menu - Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden h-10 w-10 border border-black flex flex-col items-center justify-center gap-1 hover:bg-black hover:text-white transition-colors"
        >
          <span className="h-0.5 w-6 bg-black"></span>
          <span className="h-0.5 w-6 bg-black"></span>
          <span className="h-0.5 w-6 bg-black"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-black bg-white">
          <div className="flex flex-col">
            <Link
              href="/pokedex"
              className="border-b border-black px-6 py-4 font-mono text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors block"
              onClick={() => setMenuOpen(false)}
            >
              POKÉDEX
            </Link>
            <Link
              href="/history"
              className="border-b border-black px-6 py-4 font-mono text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors block"
              onClick={() => setMenuOpen(false)}
            >
              HISTORY
            </Link>
            <Link
              href="/types"
              className="border-b border-black px-6 py-4 font-mono text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors block"
              onClick={() => setMenuOpen(false)}
            >
              TYPES
            </Link>
            <Link
              href="/generations"
              className="border-b border-black px-6 py-4 font-mono text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors block"
              onClick={() => setMenuOpen(false)}
            >
              GENERATIONS
            </Link>
            <Link
              href="/search"
              className="px-6 py-4 font-mono text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors block"
              onClick={() => setMenuOpen(false)}
            >
              SEARCH →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
