"use client";
import React from "react";
import { twMerge } from "tailwind-merge";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={twMerge(
        "bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
