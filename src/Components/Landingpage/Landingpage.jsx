"use client";
import { TypewriterEffectSmooth } from "./../ui/TypewriterEffect";
export default function Landingpage() {
  const words = [
    {
      text: "Auction",
    },
    {
      text: "Meets",
    },
    {
      text: " Fintech",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
   const wordss = [
    {
      text: "Secure",
    },
    {
      text: "Smart",
    },
    {
      text: "Transparent",
      className: "text-blue-500 dark:text-blue-500",
    },
  ]
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]  ">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
      Experience the future of auctions with blockchain security, real-time bidding, and innovative financial tools all in one platform.
      </p>
      <TypewriterEffectSmooth words={words} />

      <div
        className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <button
          className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
          Start Bidding
        </button>
        <button
          className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
          List Your Asset
        </button>
      </div>
    </div>
  );
}
