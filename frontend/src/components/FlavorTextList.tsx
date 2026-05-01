export default function FlavorTextList({ entries }: { entries: { text: string; gameVersion: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {entries.map((e, i) => (
        <div key={i} className="glass p-6 rounded-2xl group hover:bg-white/[0.08] transition-all">
          <div className="mono text-[10px] text-white/20 mb-3 uppercase font-black tracking-widest group-hover:text-red-500 transition-colors">
            {e.gameVersion.replace('-', ' ')}
          </div>
          <p className="text-sm text-white/70 leading-relaxed italic line-clamp-4 hover:line-clamp-none transition-all">
            "{e.text}"
          </p>
        </div>
      ))}
    </div>
  );
}
