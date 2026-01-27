"use client";
import { useEffect } from "react";
import Footer from "@/Components/Landingpage/Footer";
import Link from "next/link";
import useAuctions from "@/hooks/useAuction";
import { Card } from "@/Components/ui/Card";
import { Button } from "@/Components/ui/Button";
import { Clock, DollarSign, Users, Search } from "lucide-react";
import { Loader } from "@/Components/ui/Loader";
import { AuctionCardSkeleton } from "@/Components/Skeletons/AuctionCardSkeleton";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/Components/ProtectedRoute";
import Image from "next/image";

export default function Dashboard() {
  const { liveAuctions, loading: auctionsLoading } = useAuctions();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Manual auth check removed in favor of ProtectedRoute wrapper


  // Temporary mock images until backend supports themes
  const getAuctionImage = (category) => {
    // Determine image based on title/category keywords if possible
    // For now, random stylish images
    return "https://images.unsplash.com/photo-1550534791-2677533605ab?q=80&w=800&auto=format&fit=crop"; 
  };

  const renderAuctionCard = (auction) => (
    <Card key={auction.id} className="group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden p-0">
       {/* Image Background */}
       <div className="absolute inset-0 z-0">
          <Image 
            src={getAuctionImage(auction.title)} 
            alt={auction.title} 
            fill
            className="object-cover opacity-60 group-hover:opacity-40 transition-opacity"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
       </div>

       <div className="relative z-10 p-6 flex flex-col h-full min-h-[300px] justify-end">
          <div className="mb-auto">
            <span className="bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              {auction.status}
            </span>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{auction.title}</h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{auction.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
             <div className="flex items-center gap-2 text-white">
                <DollarSign size={16} />
                <span className="font-bold text-lg">${Number(auction.highestBid || auction.basePrice).toLocaleString()}</span>
             </div>
             <div className="flex items-center gap-2 text-gray-400">
                <Clock size={16} />
                <span>{new Date(auction.endTime).toLocaleDateString()}</span>
             </div>
          </div>

          <Link href={`/bid/${auction.id}`} className="w-full">
            <Button variant="primary" className="w-full bg-white text-black hover:bg-gray-200 border-none font-bold">
              Place Bid
            </Button>
          </Link>
       </div>
    </Card>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-36 pb-12 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          {/* ... content ... */}
          <div>
             <h1 className="text-4xl md:text-6xl font-black gradient-text mb-4">Live Auctions</h1>
             <p className="text-gray-400 max-w-xl text-lg">
               Discover exclusive items and place your bids in real-time. Experience the thrill of the auction.
             </p>
          </div>
          <div className="flex gap-4">
             <Link href="/createauction">
                <Button className="bg-white text-black hover:bg-gray-200 border-none font-bold">
                  + List Item
                </Button>
             </Link>
          </div>
        </div>
  
        {auctionsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1, 2, 3, 4, 5, 6].map((i) => (
               <AuctionCardSkeleton key={i} />
             ))}
          </div>
        ) : liveAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {liveAuctions.map(renderAuctionCard)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
             <h2 className="text-2xl font-bold text-gray-500 mb-4">No Active Auctions</h2>
             <p className="text-gray-400 mb-8">Be the first to list an exclusive item!</p>
             <Link href="/createauction">
                <Button>Create Auction</Button>
             </Link>
          </div>
        )}
        
        <div className="mt-20">
         <Footer />
      </div>
    </div>
    </ProtectedRoute>
  );
}
