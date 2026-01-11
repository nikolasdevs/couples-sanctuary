import { decks } from "@/data";

export default function CategoryRedirect({
  onSelect,
}: {
  onSelect: (category: string) => void;
}) {
  const categories = Object.keys(decks);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      <div className="max-w-md text-center space-y-6 px-6">
        <h2 className="text-2xl font-serif">Choose a gentler direction</h2>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className="border border-neutral-700 py-3 rounded-xl hover:border-amber-400"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
