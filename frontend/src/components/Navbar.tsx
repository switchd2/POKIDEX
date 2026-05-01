import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[var(--bg-elevated)] border-b border-[var(--border)] h-[64px] px-6">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Left side: Logo */}
        <Link href="/" className="font-bebas text-2xl flex items-center">
          <span className="text-[var(--accent-red)]">Poké</span>
          <span className="text-[var(--text-primary)]">Wiki</span>
        </Link>
        
        {/* Center: Nav links */}
        <nav aria-label="Main navigation" className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
          <Link 
            href="/pokedex" 
            aria-label="Go to Pokédex"
            className="font-sans text-sm uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)] rounded px-2 py-1 transition-colors"
          >
            Pokédex
          </Link>
          <Link 
            href="/types" 
            aria-label="Go to Types"
            className="font-sans text-sm uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)] rounded px-2 py-1 transition-colors"
          >
            Types
          </Link>
          <Link 
            href="/generations" 
            aria-label="Go to Generations"
            className="font-sans text-sm uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)] rounded px-2 py-1 transition-colors"
          >
            Generations
          </Link>
        </nav>
        
        {/* Right side: Search + Badge */}
        <div className="hidden sm:flex items-center gap-4">
          <Link 
            href="/pokedex" 
            aria-label="Search Pokémon"
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)] rounded p-1 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Link>
          <span className="bg-[var(--bg-card)] border border-[var(--border)] text-xs text-[var(--text-muted)] px-3 py-1 rounded-full font-sans" aria-label="Version 1.0.4">
            v1.0.4
          </span>
        </div>
      </div>
    </nav>
  );
}
