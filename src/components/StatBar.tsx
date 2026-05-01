interface StatBarProps {
  name: string;
  value: number;
  maxValue?: number;
}

export default function StatBar({
  name,
  value,
  maxValue = 255,
}: StatBarProps) {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="border-b border-black py-3 last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-sm font-bold uppercase tracking-wider">
          {name}
        </span>
        <span className="font-mono text-sm font-bold">{value}</span>
      </div>
      <div className="flex h-6 w-full border border-black bg-white">
        <div
          className="bg-black"
          style={{ width: `${percentage}%` }}
        ></div>
        <div
          className="bg-gray-200"
          style={{ width: `${100 - percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
