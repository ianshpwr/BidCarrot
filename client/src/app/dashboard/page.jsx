"use client";
import { useEffect, useState } from "react";
import Footer from "@/Components/Landingpage/Footer";
import Link from "next/link";
import useAuctions from "@/hooks/useAuction";
import { Card } from "@/Components/ui/Card";
import { Button } from "@/Components/ui/Button";
import { Clock, DollarSign, Users, Search, Trash2 } from "lucide-react";
import { Loader } from "@/Components/ui/Loader";
import { AuctionCardSkeleton } from "@/Components/Skeletons/AuctionCardSkeleton";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/Components/ProtectedRoute";
import Image from "next/image";
import { auctions } from "@/lib/api";
import { toast } from "sonner";

export default function Dashboard() {
  const { liveAuctions, loading: auctionsLoading, refreshAuctions } = useAuctions();
  const { user } = useAuth();
  const router = useRouter();

  // Temporary mock images until backend supports themes
  const getAuctionImage = (title) => {
    if (!title) return 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'; 
    const t = title.toLowerCase();
    if (t.includes('watch') || t.includes('rolex')) return 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop';
    if (t.includes('car') || t.includes('porsche') || t.includes('ferrari')) return 'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=800&auto=format&fit=crop';
    if (t.includes('art') || t.includes('painting')) return 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop';
    if (t.includes('mansion') || t.includes('house')) return 'https://images.unsplash.com/photo-1600596542815-2a429b08e6b9?q=80&w=800&auto=format&fit=crop';
    if (t.includes('diamond') || t.includes('gold')) return 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=800&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop';
  };

  const handleDelete = async (e, id) => {
    e.preventDefault(); // Prevent link navigation
    if (!confirm("Are you sure you want to delete this auction?")) return;
    try {
      await auctions.delete(id);
      toast.success("Auction deleted successfully");
      // Trigger refresh or update local state (useAuctions might need a refresh capability exposed)
      window.location.reload(); // Simple refresh for now
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete auction");
    }
  };

  const renderAuctionCard = (auction, isOwner = false) => {
    const hasBids = auction.bids && auction.bids.length > 0;
    
    return (
    <Card key={auction.id} className={`group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden p-0 h-full ${isOwner ? 'border-2 border-green-500/30' : ''}`}>
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
          <div className="mb-auto flex justify-between items-start">
            <span className="bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              {auction.status}
            </span>
             {isOwner && (
               <div className="flex gap-2">
                   <span className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                     My Listing
                   </span>
                    {!hasBids && (
                       <button 
                         onClick={(e) => handleDelete(e, auction.id)}
                         className="bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-full transition-colors backdrop-blur-md"
                         title="Delete Auction"
                       >
                         <Trash2 size={14} />
                       </button>
                    )}
               </div>
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{auction.title}</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
             <div className="flex flex-col text-white">
                <span className="text-xs text-gray-400">Current Price</span>
                <span className="font-bold text-lg">${Number(auction.currentPrice || auction.highestBid || auction.basePrice).toLocaleString()}</span>
             </div>
             <div className="flex flex-col text-gray-400 items-end">
                <span className="text-xs">Ends In</span>
                <span className="flex items-center gap-1 font-bold text-gray-300">
                   <Clock size={14} />
                   {new Date(auction.endTime).toLocaleDateString()}
                </span>
             </div>
          </div>

          <Link href={`/bid/${auction.id}`} className="w-full">
            <Button variant="primary" className={`w-full font-bold ${isOwner ? 'bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30' : 'bg-white text-black hover:bg-gray-200 border-none'}`}>
              {isOwner ? "Manage Auction" : "Place Bid"}
            </Button>
          </Link>
       </div>
    </Card>
  )};

  // Filter Logic
  const myAuctions = liveAuctions.filter(a => user && a.sellerId === user.id);
  const myBids = liveAuctions.filter(a => user && a.bids && a.bids.some(b => b.userId === user.id || b.bidderName === user.name));

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-36 pb-12 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
             <h1 className="text-4xl md:text-6xl font-black gradient-text mb-4">Dashboard</h1>
             <p className="text-gray-400 max-w-xl text-lg">
               Manage your auctions and track your bids.
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
           <div className="space-y-12">
             <AuctionCardSkeleton />
           </div>
        ) : (
          <div className="space-y-16">
             {/* Section 1: My Participation */}
             <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Users className="text-yellow-500" /> Bidded Auctions
                </h2>
                {myBids.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myBids.map(a => renderAuctionCard(a, a.sellerId === user?.id))}
                  </div>
                ) : (
                  <p className="text-gray-500">You haven't placed any bids yet.</p>
                )}
             </section>

             {/* Section 2: Created Auctions */}
             <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                   <DollarSign className="text-green-500" /> My Listings
                </h2>
                {myAuctions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myAuctions.map(a => renderAuctionCard(a, true))}
                  </div>
                ) : (
                  <p className="text-gray-500">You haven't listed any auctions yet.</p>
                )}
             </section>
          </div>
        )}
        
        <div className="mt-20">
         <Footer />
      </div>
    </div>
    </ProtectedRoute>
  );
}
