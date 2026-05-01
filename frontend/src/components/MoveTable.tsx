// MoveTable.tsx
export default function MoveTable({ moves }: { moves: any[] }) {
  return <p className="font-mono text-sm text-gray-500">{moves.length} moves</p>;
}
