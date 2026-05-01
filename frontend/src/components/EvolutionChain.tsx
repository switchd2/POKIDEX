import Link from "next/link";

interface EvolutionNode {
  species: { name: string; url: string };
  evolves_to: EvolutionNode[];
}

export default function EvolutionChain({ data, currentId }: { data: any, currentId: number }) {
  if (!data || !data.chain) return (
    <div className="glass p-8 rounded-2xl text-center text-white/20 uppercase tracking-widest text-xs font-black">
        Evolution Data Not Available
    </div>
  );

  const flattenChain = (node: EvolutionNode): any[] => {
    const name = node.species.name;
    const id = parseInt(node.species.url.split('/').filter(Boolean).pop() || "0");
    const result = [{ name, id }];
    
    if (node.evolves_to.length > 0) {
      result.push(...node.evolves_to.flatMap(flattenChain));
    }
    return result;
  };

  const chain = flattenChain(data.chain);

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
      {chain.map((p, i) => (
        <div key={p.name} className="flex items-center gap-8 md:gap-16">
          <Link 
            href={`/pokemon/${p.name}`}
            className={`flex flex-col items-center group ${p.id === currentId ? 'opacity-100' : 'opacity-40 hover:opacity-100'} transition-all`}
          >
            <div className={`w-32 h-32 rounded-full glass flex items-center justify-center mb-4 border-2 ${p.id === currentId ? 'border-red-500 shadow-[0_0_20px_rgba(255,62,62,0.3)]' : 'border-transparent'}`}>
              <img 
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/${p.id}.png`} 
                alt={p.name}
                className="w-24 h-24 object-contain group-hover:scale-110 transition-transform"
              />
            </div>
            <span className="font-premium font-black uppercase text-xs tracking-widest italic">{p.name}</span>
          </Link>
          
          {i < chain.length - 1 && (
            <div className="hidden md:block">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white/10"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
