export default function FlavorTextList({
  entries,
}: {
  entries: { version: { name: string }; flavorText: string }[];
}) {
  // Deduplicate entries by text, keep the first version
  const uniqueEntries = entries.reduce((acc, current) => {
    const x = acc.find((item) => item.flavorText === current.flavorText);
    if (!x) {
      return acc.concat([current]);
    } else {
      // maybe append version name
      x.version.name += ` / ${current.version.name}`;
      return acc;
    }
  }, [] as { version: { name: string }; flavorText: string }[]);

  return (
    <div className="w-full font-mono text-sm">
      <div className="border border-black">
        {uniqueEntries.map((entry, idx) => (
          <div
            key={idx}
            className={`flex flex-col md:flex-row border-black ${
              idx !== uniqueEntries.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="w-full md:w-1/4 p-4 border-b md:border-b-0 md:border-r border-black bg-gray-50 uppercase font-bold text-xs tracking-widest flex items-center">
              {entry.version.name.replace(/-/g, " ")}
            </div>
            <div className="w-full md:w-3/4 p-4 text-gray-800 leading-relaxed">
              &quot;{entry.flavorText.replace(/\f/g, " ").replace(/\n/g, " ")}&quot;
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
