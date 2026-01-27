"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { auctions, bids } from "@/lib/api";
import { Card } from "@/Components/ui/Card";
import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import { Clock, ArrowLeft, Gavel, ShieldCheck, Trophy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/Components/ui/Loader";
import { toast } from "sonner"; // Adding toast for consistency

export default function AuctionDetailClient({ id }) {
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [placeBidLoading, setPlaceBidLoading] = useState(false);
  const { user, refreshUser } = useAuth();

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

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await auctions.getOne(id);
        setAuction(res.data);
      } catch (err) {
        console.error("Failed to fetch auction", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAuction();
  }, [id]);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!user) return; // Should be handled by UI state, but safe check
    
    setPlaceBidLoading(true);
    try {
      await bids.create({ auctionId: id, amount: parseFloat(bidAmount) });
      toast.success("Bid placed successfully!");
      // Refresh auction data
      const res = await auctions.getOne(id);
      setAuction(res.data);
      if (refreshUser) refreshUser();
      setBidAmount("");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to place bid");
    } finally {
      setPlaceBidLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  if (!auction) return <div className="text-center text-white pt-36">Auction not found</div>;

  const currentPrice = auction.currentPrice || auction.basePrice;
  const isHighestBidder = user && auction.highestBidder === user.name; // This depends on backend response structure, assuming similar to before

  return (
    <div className="min-h-screen pt-36 pb-12 px-4 max-w-7xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Image & Info */}
        <div className="space-y-8">
           <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-square group">
              <Image 
                src={getAuctionImage(auction.title)} 
                alt={auction.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                 <span className="text-white font-bold flex items-center gap-2">
                   <Clock size={16} className="text-yellow-500" />
                   {new Date(auction.endTime).toLocaleDateString()}
                 </span>
              </div>
           </div>
           
           <Card>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="text-green-400" /> Authenticity Guarantee
              </h3>
              <p className="text-gray-400 text-sm">
                Every item on BidCarrot is verified by our team of experts to ensure authenticity and quality.
              </p>
           </Card>
        </div>

        {/* Right: Bidding Control */}
        <div className="space-y-6">
           <div>
             <h1 className="text-4xl md:text-5xl font-black mb-2">{auction.title}</h1>
             <p className="text-xl text-gray-400">{auction.description}</p>
           </div>

           <Card className="border-yellow-500/20 bg-yellow-500/5">
              <div className="flex justify-between items-end mb-8">
                 <div>
                   <p className="text-gray-400 mb-1">Current Highest Bid</p>
                   <p className="text-5xl font-black gradient-text">${currentPrice.toLocaleString()}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-gray-400 mb-1">Total Bids</p>
                    <p className="text-2xl font-bold">{auction.bids?.length || 0}</p>
                 </div>
              </div>

              {user ? (
                <form onSubmit={handlePlaceBid} className="space-y-4">
                   <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input 
                        type="number" 
                        placeholder={`Enter amount > ${currentPrice}`}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-8 pr-4 text-xl font-bold outline-none focus:border-yellow-500 transition-colors"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={currentPrice + 1}
                        required
                      />
                   </div>
                   <Button 
                     type="submit" 
                     disabled={placeBidLoading} 
                     className="w-full h-14 text-lg font-bold bg-yellow-500 hover:bg-yellow-400 text-black"
                   >
                     {placeBidLoading ? <Loader className="border-black" /> : 'Place Bid'}
                   </Button>
                   <p className="text-center text-sm text-gray-400">
                     By placing a bid, you agree to our Terms of Service
                   </p>
                </form>
              ) : (
                <div className="text-center py-6">
                   <p className="text-gray-400 mb-4">Please login to participate in this auction</p>
                   <Link href="/login">
                     <Button className="w-full font-bold">Login to Bid</Button>
                   </Link>
                </div>
              )}
           </Card>

           {/* Bid History */}
           <Card>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="text-yellow-500" /> Recent Activity
              </h3>
              <div className="space-y-4">
                 {auction.bids && auction.bids.length > 0 ? (
                   [...auction.bids].reverse().slice(0, 5).map((bid, i) => (
                     <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center font-bold text-xs">
                             {bid.bidderName ? bid.bidderName[0] : 'U'}
                           </div>
                           <span className="font-medium text-gray-300">
                             {bid.bidderName || 'Anonymous'}
                           </span>
                        </div>
                        <span className="font-bold text-white">${bid.amount.toLocaleString()}</span>
                     </div>
                   ))
                 ) : (
                   <p className="text-gray-500 text-center py-4">No bids yet. Be the first!</p>
                 )}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
