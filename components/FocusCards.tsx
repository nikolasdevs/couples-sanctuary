import { FocusCards } from "@/components/ui/focus-cards";

export function FocusCardsDemo() {
  const cards = [
    {
      title: "Shuffle Mode",
      src: "https://res.cloudinary.com/dpnzmcban/image/upload/v1768177745/IMG_7223_wqbwk8.jpg",
      link: "/experience/play?mode=shuffle",
    },
    {
      title: "Sanctuary Flow",
      src: "https://res.cloudinary.com/dpnzmcban/image/upload/v1768177741/IMG_7221_otbxdj.jpg",
      link: "/experience/play?mode=sanctuary",
    },
    {
      title: "Choose a Category",
      src: "https://res.cloudinary.com/dpnzmcban/image/upload/v1768177737/IMG_7222_aiwfpo.jpg",
      link: "/experience/play?mode=category",
    },
  ];

  return <FocusCards cards={cards} />;
}
