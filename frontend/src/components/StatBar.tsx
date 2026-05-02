export default function StatBar({ label, value }: { label: string; value: number }) {
  const maxValue = 255;
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  // Choose color based on stat type
  const getStatColor = (l: string) => {
    const low = l.toLowerCase();
    if (low.includes('hp')) return 'bg-green-500';
    if (low.includes('attack')) return 'bg-red-500';
    if (low.includes('defense')) return 'bg-blue-500';
    if (low.includes('speed')) return 'bg-yellow-500';
    return 'bg-purple-500';
  };

  const barColor = getStatColor(label);

  return (
    <div className="flex items-center gap-6">
      <span className="mono text-[10px] font-bold uppercase text-[var(--text-muted)] w-24 flex-shrink-0 tracking-widest">
        {label.replace('-', ' ')}
      </span>
      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full ${barColor} rounded-full transition-all duration-1000`} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
      <span className="mono text-xs font-bold w-8 text-right text-[var(--text-primary)]">{value}</span>
    </div>
  );
}
