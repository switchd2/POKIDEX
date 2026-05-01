interface StatPillProps {
  label: string;
  value: string | number;
}

export default function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-4 py-2 flex flex-col justify-center">
      <span className="text-xs text-[var(--text-muted)] uppercase font-sans tracking-wider">{label}</span>
      <span className="text-2xl font-bebas text-[var(--accent-blue)] leading-none mt-1">{value}</span>
    </div>
  );
}
