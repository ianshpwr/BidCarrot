"use client";
import React from "react";
import useAuctions from "@/hooks/useAuction";
import Link from "next/link";
import { Card } from "@/Components/ui/Card";
import { Button } from "@/Components/ui/Button";
import { Clock, DollarSign } from "lucide-react";
import { Loader } from "@/Components/ui/Loader";

export default function Auction() {
  const { liveAuctions, loading } = useAuctions();

  const getAuctionImage = (title) => {
    return "https://images.unsplash.com/photo-1550534791-2677533605ab?q=80&w=800&auto=format&fit=crop"; 
  };

  const renderAuctionCard = (auction) => (
    <Card key={auction.id} className="group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden p-0 h-full">
       <div className="absolute inset-0 z-0">
          <img 
            src={getAuctionImage(auction.title)} 
            alt={auction.title} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
       </div>

       <div className="relative z-10 p-6 flex flex-col h-full min-h-[350px] justify-end">
          <div className="mb-auto">
            <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              {auction.status}
            </span>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{auction.title}</h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{auction.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
             <div className="flex items-center gap-2 text-yellow-500">
                <DollarSign size={16} />
                <span className="font-bold text-lg">${Number(auction.highestBid || auction.basePrice).toLocaleString()}</span>
             </div>
             <div className="flex items-center gap-2 text-gray-400">
                <Clock size={16} />
                <span>{new Date(auction.endTime).toLocaleDateString()}</span>
             </div>
          </div>

          <Link href={`/bid/${auction.id}`} className="w-full">
            <Button variant="primary" className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white">
              Place Bid
            </Button>
          </Link>
       </div>
    </Card>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="mb-12 text-center">
         <h1 className="text-4xl md:text-6xl font-black gradient-text mb-4">Discover Auctions</h1>
         <p className="text-gray-400 max-w-2xl mx-auto text-lg">
           Explore a curated collection of premium items available for bidding.
         </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
           <Loader />
        </div>
      ) : liveAuctions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {liveAuctions.map(renderAuctionCard)}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
           <h2 className="text-2xl font-bold text-gray-500 mb-4">No Active Auctions</h2>
           <p className="text-gray-400 mb-8">We are restocking premium items. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
