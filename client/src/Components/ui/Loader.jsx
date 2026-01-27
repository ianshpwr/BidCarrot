"use client";
import React from "react";
import { motion } from "framer-motion";

export const Loader = ({ className = "w-16 h-16" }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-4`}>
      <div className={`relative ${className}`}>
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-white"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
           className="absolute inset-4 rounded-full bg-white/20 blur-md"
           animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 0.8, 0.5] }}
           transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <motion.p 
        className="text-white font-bold tracking-widest text-xs uppercase"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading
      </motion.p>
    </div>
  );
};

export const FullScreenLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
    <Loader />
  </div>
);
