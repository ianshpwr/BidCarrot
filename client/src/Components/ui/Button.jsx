"use client";
import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export function Button({ className, variant = "primary", children, ...props }) {
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary: "bg-black/50 text-white border border-white/20 hover:bg-black/70",
    danger: "bg-red-500/80 text-white hover:bg-red-600",
    ghost: "bg-transparent text-white hover:bg-white/10",
  };

  return (
    <button
      className={twMerge(
        clsx(
          "px-4 py-2 rounded-lg font-medium transition-all duration-300 backdrop-blur-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
}
