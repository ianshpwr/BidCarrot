"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/Components/ui/Button";
import { Menu, X, Wallet, ChevronDown, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbarr() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { name: "Live Auctions", link: "/auction" },
    { name: "Dashboard", link: "/dashboard" },
    { name: "Create Auction", link: "/createauction" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-4">
      <div className="max-w-7xl mx-auto glass rounded-full px-6 py-3 flex items-center justify-between shadow-2xl border border-white/10 relative bg-black/40 backdrop-blur-xl">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tighter gradient-text">
            BidCarrot
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors hover:scale-105 transform duration-200"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Wallet Display */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
                <Wallet size={16} />
                <span className="font-bold text-sm">
                  ${user.wallet ? user.wallet.toLocaleString() : '0'}
                </span>
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-white hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span>{user.name || 'User'}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-xl overflow-hidden py-1 z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setIsProfileOpen(false)}>
                        <div className="px-4 py-2 hover:bg-white/5 flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer transition-colors">
                           <User size={16} /> Profile
                        </div>
                      </Link>
                      <button 
                        onClick={() => { logout(); setIsProfileOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-red-500/10 flex items-center gap-2 text-sm text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                      >
                         <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="primary" className="text-xs px-6 py-2 h-9">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-20 left-4 right-4 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 md:hidden shadow-2xl z-50"
          >
             <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg gradient-text">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-white/10 rounded-full">
                  <X size={24} />
                </button>
             </div>
             
             {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-gray-300 hover:text-white py-2 border-b border-white/5"
              >
                {item.name}
              </Link>
            ))}

            <div className="mt-2 pt-2">
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                     <span className="text-gray-300">Balance</span>
                     <span className="font-bold text-yellow-500">${user.balance ? user.balance.toLocaleString() : '0'}</span>
                  </div>
                  <Button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full bg-red-500/10 text-red-400 hover:bg-red-500/20 border-none">
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
