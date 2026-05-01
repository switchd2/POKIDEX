import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "PokéWiki - The Complete Pokémon Encyclopedia",
  description:
    "PokéWiki: 1,025 Pokémon. 9 Generations. Every detail documented. A minimalist editorial encyclopedia of all Pokémon species.",
  keywords: [
    "pokémon",
    "pokedex",
    "encyclopedia",
    "database",
    "pokemon",
    "bulbasaur",
    "charizard",
  ],
  authors: [{ name: "PokéWiki" }],
  openGraph: {
    title: "PokéWiki - The Complete Pokémon Encyclopedia",
    description: "1,025 Pokémon. 9 Generations. Every detail documented.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full scroll-smooth ${bebasNeue.variable} ${ibmPlexMono.variable}`}>
      <body className="min-h-full w-full bg-white text-black antialiased font-mono flex flex-col">
        <NavBar />
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
