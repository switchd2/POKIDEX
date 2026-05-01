import Image from "next/image";

interface PokemonSpriteProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export default function PokemonSprite({
  src,
  alt,
  width = 200,
  height = 200,
  priority = false,
  className = "",
}: PokemonSpriteProps) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center border border-black bg-gray-100 ${className}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <span className="font-mono text-sm text-gray-400">N/A</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
