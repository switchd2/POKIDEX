import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-[var(--border)] h-[72px] px-6">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Left side: Logo */}
        <Link href="/" className="font-extrabold text-2xl flex items-center tracking-tight">
          <span className="text-[var(--accent-red)]">POKI</span>
          <span className="text-[var(--text-primary)]">DEX</span>
        </Link>
        
        {/* Center: Nav links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
          <Link 
            href="/" 
            className="text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/pages/pokedex" 
            className="text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors"
          >
            Pokémon
          </Link>
          <Link 
            href="/pages/types" 
            className="text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors"
          >
            Types
          </Link>
          <Link 
            href="/pages/generations" 
            className="text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-red)] transition-colors"
          >
            Generations
          </Link>
        </nav>
        
        {/* Right side: Search + CTA */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <span className="bg-slate-100 text-[10px] font-bold text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">
              v2.0.0
            </span>
          </div>
          <Link 
            href="/pages/pokedex" 
            className="bg-[var(--text-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
