export default function SectionDivider({ label }: { label?: string }) {
  if (!label) {
    return <hr className="w-full border-black border-t" />;
  }

  return (
    <div className="flex items-center w-full">
      <div className="flex-1 border-t border-black"></div>
      <span className="px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">
        {label}
      </span>
      <div className="flex-1 border-t border-black"></div>
    </div>
  );
}
