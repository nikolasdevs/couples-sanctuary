import { decks } from "@/data";
import { motion, useReducedMotion } from "framer-motion";

export default function CategoryRedirect({
  onSelect,
}: {
  onSelect: (category: string) => void;
}) {
  const categories = Object.keys(decks);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-zinc-50 shadow-2xl shadow-black/40"
        initial={
          reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }
        }
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={
          reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.99 }
        }
        transition={{
          duration: reduceMotion ? 0 : 0.22,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <h2
          id="category-title"
          className="text-2xl font-semibold tracking-tight"
        >
          Choose a gentler direction
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-200">
          Pick a theme that feels safer right now.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className="rounded-xl border border-white/12 bg-white/5 px-3 py-3 text-sm font-semibold text-zinc-50 transition hover:bg-white/10 hover:border-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B11226]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
