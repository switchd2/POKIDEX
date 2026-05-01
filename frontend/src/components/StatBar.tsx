import React from "react";

interface StatBarProps {
  name: string;
  value: number;
}

export default function StatBar({ name, value }: StatBarProps) {
  // Max base stat is usually 255
  const maxStat = 255;
  const percentage = Math.min(100, Math.max(0, (value / maxStat) * 100));

  return (
    <div className="flex items-center justify-between border-b border-black px-4 py-2 last:border-b-0">
      <div className="w-24 flex-shrink-0 font-mono text-sm font-bold uppercase">
        {name}
      </div>
      <div className="w-12 text-right font-mono text-sm font-bold">
        {value}
      </div>
      <div className="ml-4 flex-grow">
        <div className="h-3 w-full border border-black bg-gray-100">
          <div
            className="h-full bg-black transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
