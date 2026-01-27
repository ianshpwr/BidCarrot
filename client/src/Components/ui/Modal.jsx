"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl">
               <div className="flex items-center justify-between p-4 border-b border-white/5">
                 <h3 className="text-lg font-semibold text-white">{title}</h3>
                 <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors text-white">
                   <X size={20} />
                 </button>
               </div>
               <div className="p-6">
                 {children}
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
