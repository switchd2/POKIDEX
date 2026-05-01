interface TypeBadgeProps {
  type: string;
}

export default function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider type-${type.toLowerCase()} whitespace-nowrap`}>
      {type}
    </span>
  );
}
