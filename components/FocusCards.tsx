import { FocusCards } from "@/components/ui/focus-cards";

export function FocusCardsDemo() {
  const cards = [
    {
      title: "Sanctuary Flow",
      src: "https://res.cloudinary.com/dpnzmcban/image/upload/v1768177741/IMG_7221_otbxdj.jpg",
      link: "/experience?flow=sanctuary",
      featured: true,
      description:
        "A guided progression designed to deepen connection step by step.",
      meta: "Best first choice • 10–15 min",
    },
    {
      title: "Shuffle Mode",
      src: "https://res.cloudinary.com/dpnzmcban/image/upload/v1768177745/IMG_7223_wqbwk8.jpg",
      link: "/experience/play?mode=shuffle",
      description:
        "Jump into a mix of prompts—surprising, playful, and spontaneous.",
      meta: "Fast start • 5–10 min",
    },
    {
      title: "Choose a Category",
      src: "https://res.cloudinary.com/dpnzmcban/image/upload/v1768177737/IMG_7222_aiwfpo.jpg",
      link: "/experience/play?mode=category",
      description:
        "Pick a theme that fits the moment (communication, intimacy, future, etc.).",
      meta: "Most control • any pace",
    },
  ];

  return <FocusCards cards={cards} />;
}
