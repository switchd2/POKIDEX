import "./globals.css";
import { Metadata } from "next";
import { Bebas_Neue, DM_Sans, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";

const bebasNeue = Bebas_Neue({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas'
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans'
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains'
});

export const metadata: Metadata = {
  title: "PokéWiki — The Ultimate Pokémon Archive",
  description: "Explore the vast world of Pokémon with cutting-edge data and stunning visuals.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <div className="min-h-screen relative flex flex-col">
          <Navbar />
          <main className="flex-grow pt-[64px]">
            {children}
          </main>
          
          <footer className="bg-[var(--bg-elevated)] border-t border-[var(--border)] py-12 px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <div className="text-2xl font-bebas text-[var(--text-primary)]">
                  <span className="text-[var(--accent-red)]">Poké</span>Wiki
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-4 max-w-sm">
                  The most comprehensive and visually stunning Pokémon encyclopedia ever built. Data powered by PokéAPI. Built for the community.
                </p>
              </div>
              
              <div>
                <h4 className="font-sans font-semibold text-sm text-[var(--text-primary)] mb-4">Resources</h4>
                <div className="flex flex-col space-y-3">
                  <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors">API Documentation</a>
                  <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors">Community Discord</a>
                  <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors">GitHub Repository</a>
                </div>
              </div>
              
              <div>
                <h4 className="font-sans font-semibold text-sm text-[var(--text-primary)] mb-4">Legal</h4>
                <div className="flex flex-col space-y-3">
                  <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors">Privacy Policy</a>
                  <a href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors">Terms of Service</a>
                </div>
              </div>
            </div>
            <div className="border-t border-[var(--border)] mt-8 pt-6 text-center text-xs text-[var(--text-muted)] max-w-7xl mx-auto">
              © 2026 PokéWiki Project. All Sprites & Characters are property of Nintendo & The Pokémon Company.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

