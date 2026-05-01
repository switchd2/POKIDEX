import Link from "next/link";

interface SectionHeaderProps {
  label: string;
  title: string;
  linkText?: string;
  linkHref?: string;
}

export default function SectionHeader({ label, title, linkText, linkHref }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-end mb-8">
      <div>
        <span className="block text-xs uppercase tracking-widest text-[var(--accent-red)] font-sans mb-2">
          {label}
        </span>
        <h2 className="font-bebas text-4xl text-[var(--text-primary)] leading-none">
          {title}
        </h2>
      </div>
      {linkText && linkHref && (
        <Link href={linkHref} className="text-sm font-sans text-[var(--accent-blue)] hover:underline mb-1">
          {linkText}
        </Link>
      )}
    </div>
  );
}
