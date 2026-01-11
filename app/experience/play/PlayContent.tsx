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
  }>(() => generateCard());

  useEffect(() => {
    if (mode === "category") {
      setCategoryMode(true);
    }
  }, [mode]);

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
    const saved = localStorage.getItem("sanctuary-current-card");

    if (saved) {
      const parsed = JSON.parse(saved);

      if (parsed.mode === mode) {
        setIndex(parsed.index);
        setCurrentCard(parsed.card);
        return;
      }
    }

    setCurrentCard(generateCard());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentCard) return null;
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
        <div className="max-w-xl space-y-10">
          <span
            className={`uppercase text-amber-400 tracking-widest text-sm transition-opacity duration-300 ${
              fading ? "opacity-0" : "opacity-100"
            }`}
          >
            {card.category}
          </span>

          <p
            className={`text-2xl md:text-3xl font-serif leading-relaxed transition-opacity duration-300 ${
              fading ? "opacity-0" : "opacity-100"
            }`}
          >
            {card.text}
          </p>

          <div className="flex justify-center gap-4">
            <AmbientAudio />
            <button onClick={() => setPause(true)} className="text-neutral-400">
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
              className="text-red-400"
            >
              🕊 Safe
            </button>
          </div>

          {mode === "sanctuary" && (
            <Progress current={index + 1} total={sanctuaryFlow.length} />
          )}

          <div className="flex flex-col gap-8">
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
              className="text-sm text-red-400 border px-4 py-2 rounded-full hover:border-red-400 hover:bg-red-400 hover:text-red-50 transition-self"
            >
              End Session
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
