import React from "react";

interface FlavorTextEntry {
  flavorText: string;
  version: {
    name: string;
  };
}

interface FlavorTextListProps {
  entries: FlavorTextEntry[];
}

export default function FlavorTextList({ entries }: FlavorTextListProps) {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="space-y-4 border border-black divide-y divide-black bg-white">
      {entries.map((entry, idx) => (
        <div key={idx} className="p-4">
          <div className="mb-2 font-mono text-xs font-bold uppercase text-gray-500">
            VERSION {entry.version.name}
          </div>
          <p className="font-mono text-sm leading-relaxed text-gray-800">
            "{entry.flavorText}"
          </p>
        </div>
      ))}
    </div>
  );
}
