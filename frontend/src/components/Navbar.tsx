'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pages/pokedex", label: "Pokémon" },
  { href: "/pages/types", label: "Types" },
  { href: "/pages/generations", label: "Generations" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-[var(--border)] h-[64px] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="font-extrabold text-xl sm:text-2xl flex items-center tracking-tight flex-shrink-0">
            <span className="text-[var(--accent-red)]">POKI</span>
            <span className="text-[var(--text-primary)]">DEX</span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold transition-colors ${
                  pathname === link.href
                    ? "text-[var(--accent-red)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--accent-red)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block bg-slate-100 text-[10px] font-bold text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">
              v2.0.0
            </span>
            <Link
              href="/pages/pokedex"
              className="hidden sm:inline-flex bg-[var(--text-primary)] text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>

            {/* Hamburger Button (mobile only) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors gap-[5px]"
            >
              <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
              <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile navigation"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 h-[64px] border-b border-[var(--border)]">
          <span className="font-extrabold text-xl tracking-tight">
            <span className="text-[var(--accent-red)]">POKI</span>
            <span className="text-[var(--text-primary)]">DEX</span>
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex-1 flex flex-col p-6 gap-1" aria-label="Mobile links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-colors ${
                pathname === link.href
                  ? "bg-red-50 text-[var(--accent-red)]"
                  : "text-[var(--text-secondary)] hover:bg-slate-50 hover:text-[var(--text-primary)]"
              }`}
            >
              {link.label === "Home" && "🏠"}
              {link.label === "Pokémon" && "🎮"}
              {link.label === "Types" && "🔥"}
              {link.label === "Generations" && "🌍"}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-[var(--border)]">
          <Link
            href="/pages/pokedex"
            className="block w-full text-center bg-[var(--accent-red)] text-white px-4 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Explore All Pokémon →
          </Link>
          <p className="text-center text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-widest">POKIDEX v2.0.0</p>
        </div>
      </aside>
    </>
  );
}
