"use client";
import { HoverEffect } from "../ui/Cardhover";

export default function CardHoverEffect() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}
export const projects = [
  {
    title: "Sarah Chen",
    role: "Venture Capitalist",
    description:
      "A technology company that builds economic infrastructure for the internet.",
  },
  {
    title: "Marcus Rodriguez",
    role: "NFT Collector",
    description:
      "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
  },
  {
    title: "Emily Foster",
        role: "Art Dealer",
    description:
      "A multinational technology company that specializes in Internet-related services and products.",
  }
];
