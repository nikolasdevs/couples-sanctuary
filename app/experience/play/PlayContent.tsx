"use client";

import AmbientAudio from "@/components/AmbientAudio";
import CategoryRedirect from "@/components/CategoryRedirect";
import PauseOverlay from "@/components/PauseOverlay";
import Progress from "@/components/Progress";
import SafeConfirm from "@/components/SafeConfirm";
import SafeFlow from "@/components/SafeFlow";
import { decks } from "@/data";
import { sanctuaryFlow } from "@/data/sanctuaryFlow";
import { randomItem } from "@/lib/random";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlayContent() {
  const params = useSearchParams();
  const router = useRouter();
  const mode = params.get("mode") || "shuffle";
  const [fading, setFading] = useState(false);
  const [categoryMode, setCategoryMode] = useState(false);
  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(false);
  const [safe, setSafe] = useState<null | "active" | "confirm" | "redirect">(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const [mounted, setMounted] = useState(false);

  const generateCard = () => {
    if (mode === "sanctuary") {
      const category = sanctuaryFlow[index];
      return {
        category,
        text: randomItem(decks[category as keyof typeof decks]),
      };
    }

    if (mode === "category" && selectedCategory) {
      return {
        category: selectedCategory,
        text: randomItem(decks[selectedCategory as keyof typeof decks]),
      };
    }

    const categories = Object.keys(decks) as (keyof typeof decks)[];
    const category = randomItem(categories);
    return { category, text: randomItem(decks[category]) };
  };

  const [currentCard, setCurrentCard] = useState<{
    category: string;
    text: string;
  } | null>(null);

  useEffect(() => {
    if (mode === "category") {
      setCategoryMode(true);
    }
  }, [mode]);

  useEffect(() => {
    // run only on client
    setMounted(true);

    const saved =
      typeof window !== "undefined" &&
      localStorage.getItem("sanctuary-current-card");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (parsed.mode === mode) {
          setIndex(parsed.index);
          setCurrentCard(parsed.card);
          return;
        }
      } catch {
        // ignore parse errors
      }
    }

    // generate a deterministic card on client mount
    setCurrentCard(generateCard());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on client mount

  useEffect(() => {
    if (!currentCard) return;

    localStorage.setItem(
      "sanctuary-current-card",
      JSON.stringify({
        card: currentCard,
        index,
        mode,
      })
    );
  }, [currentCard, index, mode]);

  useEffect(() => {
    if (mode === "category") {
      setCategoryMode(true);
    }
  }, [mode]);

  if (!mounted || !currentCard) {
    // render nothing (or a lightweight skeleton) until client has mounted and card generated
    return null;
  }
  const card = currentCard;

  const handleNext = () => {
    if (pause || safe || fading) return;

    setFading(true);

    setTimeout(() => {
      setIndex((i) => i + 1);
      setCurrentCard(generateCard());
      setFading(false);
    }, 300);
  };

  const skipCard = () => {
    setSafe(null);
    setFading(true);

    setTimeout(() => {
      setIndex((i) => i + 1);
      setCurrentCard(generateCard());
      setFading(false);
    }, 300);
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 text-center"
      onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX === null) return;

        const deltaX = e.changedTouches[0].clientX - touchStartX;

        if (deltaX < -60) {
          handleNext();
        }

        setTouchStartX(null);
      }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dpnzmcban/image/upload/v1768124994/ba8728b6-a5a4-4659-b3d5-3b2946b04fcb_qtq1yh.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/80 to-black/90 backdrop-blur-[2px]" />
      </div>

      {pause && <PauseOverlay onResume={() => setPause(false)} />}

      {safe === "active" && (
        <SafeFlow
          onRedirect={() => setSafe("redirect")}
          onSkip={() => setSafe("confirm")}
          onEnd={() => {
            localStorage.removeItem("sanctuary-current-card");
            router.push("/experience/end");
          }}
          onReconsider={() => setSafe(null)}
        />
      )}

      {safe === "confirm" && (
        <SafeConfirm
          onConfirm={skipCard}
          onCancel={() => setSafe("redirect")}
          onReconsider={() => setSafe("active")}
        />
      )}

      {safe === "redirect" && (
        <CategoryRedirect
          onSelect={(category) => {
            setSafe(null);
            setCurrentCard({
              category,
              text: randomItem(decks[category as keyof typeof decks]),
            });
          }}
        />
      )}

      {categoryMode && (
        <CategoryRedirect
          onSelect={(category) => {
            setSelectedCategory(category);
            setCategoryMode(false);
            setCurrentCard({
              category,
              text: randomItem(decks[category as keyof typeof decks]),
            });
          }}
        />
      )}

      {!categoryMode && (
        <div className="max-w-xl space-y-16 z-30 pointer-events-auto">
          <AmbientAudio />
          <div className="flex flex-col gap-4">
            <span
              className={` uppercase text-amber-400 tracking-widest font-semibold text-sm transition-opacity duration-300 ${
                fading ? "opacity-0" : "opacity-100"
              }`}
            >
              {card.category}
            </span>

            <p
              className={`text-2xl md:text-3xl font-semibold font-serif leading transition-opacity duration-200 ${
                fading ? "opacity-0" : "opacity-100"
              }`}
            >
              {card.text}
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setPause(true)}
              className="text-neutral-400 font-semibold"
            >
              ⏸ Pause
            </button>
            <button
              onClick={handleNext}
              className="border border-amber-400 px-6 py-2 rounded-full text-amber-300"
            >
              Next
            </button>
            <button
              onClick={() => {
                setSafe("active");
                setPause(false);
              }}
              className="text-emerald-600 font-semibold"
            >
              🕊 Safe
            </button>
          </div>

          {mode === "sanctuary" && (
            <Progress current={index + 1} total={sanctuaryFlow.length} />
          )}

          <div className="flex flex-col items-center gap-8">
            {" "}
            {mode === "category" && selectedCategory && (
              <button
                onClick={() => setCategoryMode(true)}
                className=" text-amber-300"
              >
                Change Category
              </button>
            )}
            <button
              onClick={() => {
                localStorage.removeItem("sanctuary-current-card");
                router.push("/experience/end");
              }}
              className="text-[#B11226]
    border border-[#B11226]
    px-4 py-3 rounded-full
    cursor-pointer
    pointer-events-auto
    hover:bg-[#B11226] hover:text-red-50
    transition-all hover:font-semibold font-medium
"
            >
              End Session
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
