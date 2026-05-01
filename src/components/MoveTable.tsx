"use client";

import { useState } from "react";

interface MoveData {
  name: string;
  level: number;
  type: string;
  category: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
}

interface MoveTableProps {
  moves: MoveData[];
  defaultTab?: "levelup" | "tutor" | "egg" | "tm";
}

export default function MoveTable({
  moves,
  defaultTab = "levelup",
}: MoveTableProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [sortBy, setSortBy] = useState<"level" | "name" | "power">("level");

  if (!moves || moves.length === 0) {
    return (
      <div className="border-t border-black py-6">
        <h3 className="mb-4 text-lg font-bold uppercase tracking-wider">
          Moves
        </h3>
        <p className="font-mono text-sm text-gray-500">No moves found</p>
      </div>
    );
  }

  return (
    <div className="border-t border-black py-6">
      <h3 className="mb-4 text-lg font-bold uppercase tracking-wider">Moves</h3>

      {/* Sort options */}
      <div className="mb-4 flex gap-2">
        {(["level", "name", "power"] as const).map((option) => (
          <button
            key={option}
            onClick={() => setSortBy(option)}
            className={`border border-black px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
              sortBy === option
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            SORT: {option.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-black">
          <thead>
            <tr className="border-b border-black bg-gray-100">
              <th className="border-r border-black px-3 py-2 text-left font-mono text-xs font-bold uppercase tracking-wider">
                Level
              </th>
              <th className="border-r border-black px-3 py-2 text-left font-mono text-xs font-bold uppercase tracking-wider">
                Name
              </th>
              <th className="border-r border-black px-3 py-2 text-left font-mono text-xs font-bold uppercase tracking-wider">
                Type
              </th>
              <th className="border-r border-black px-3 py-2 text-left font-mono text-xs font-bold uppercase tracking-wider">
                Category
              </th>
              <th className="border-r border-black px-3 py-2 text-center font-mono text-xs font-bold uppercase tracking-wider">
                PWR
              </th>
              <th className="border-r border-black px-3 py-2 text-center font-mono text-xs font-bold uppercase tracking-wider">
                ACC
              </th>
              <th className="px-3 py-2 text-center font-mono text-xs font-bold uppercase tracking-wider">
                PP
              </th>
            </tr>
          </thead>
          <tbody>
            {moves.map((move, index) => (
              <tr
                key={index}
                className={`border-b border-black last:border-b-0 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="border-r border-black px-3 py-2 font-mono text-xs">
                  {move.level > 0 ? move.level : "—"}
                </td>
                <td className="border-r border-black px-3 py-2 font-mono text-xs font-bold uppercase">
                  {move.name}
                </td>
                <td className="border-r border-black px-3 py-2 font-mono text-xs uppercase">
                  {move.type}
                </td>
                <td className="border-r border-black px-3 py-2 font-mono text-xs uppercase">
                  {move.category}
                </td>
                <td className="border-r border-black px-3 py-2 text-center font-mono text-xs">
                  {move.power || "—"}
                </td>
                <td className="border-r border-black px-3 py-2 text-center font-mono text-xs">
                  {move.accuracy ? `${move.accuracy}%` : "—"}
                </td>
                <td className="px-3 py-2 text-center font-mono text-xs">
                  {move.pp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
