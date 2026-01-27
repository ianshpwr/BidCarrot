"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { auctions, bids } from "@/lib/api";
import { Card } from "@/Components/ui/Card";
import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import { Clock, DollarSign, ArrowLeft, TrendingUp, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/Components/ui/Loader";

export default function AuctionDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [auction, setAuction] = useState(null);
  const [bidsList, setBidsList] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [placingBid, setPlacingBid] = useState(false);
  
  // Polling ref
  const pollInterval = useRef(null);

  const fetchAuctionData = async () => {
    try {
      const res = await auctions.getOne(id);
      const data = res.data;
      setAuction(data);
      if (data.bids) {
        // Sort bids desc
        setBidsList(data.bids.sort((a, b) => b.amount - a.amount));
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch auction", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAuctionData();
      // Poll every 5 seconds
      pollInterval.current = setInterval(fetchAuctionData, 5000);
    }
    return () => clearInterval(pollInterval.current);
  }, [id]);

  const currentBid = bidsList.length > 0 ? bidsList[0].amount : (auction?.highestBid || auction?.basePrice || 0);
  const minBid = currentBid + 10; // Min increment 10? Maybe 5%? Let's say +10 for now.

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!bidAmount) return;
    if (Number(bidAmount) <= currentBid) {
      setError(`Bid must be higher than $${currentBid}`);
      return;
    }

    setError("");
    setPlacingBid(true);

    try {
      await bids.create({ auctionId: id, amount: Number(bidAmount) });
      setBidAmount("");
      // Immediate refresh
      await fetchAuctionData();
      alert("Bid placed successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place bid");
    } finally {
      setPlacingBid(false);
    }
  };

  const getAuctionImage = (title) => {
    return "https://images.unsplash.com/photo-1550534791-2677533605ab?q=80&w=800&auto=format&fit=crop"; 
  };

  if (loading) return (
     <div className="min-h-screen flex items-center justify-center -mt-20">
        <Loader />
     </div>
  );

  if (!auction) return <div className="text-center pt-20">Auction not found</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Image & Info */}
        <div className="space-y-8">
           <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-square group">
              <img 
                src={getAuctionImage(auction.title)} 
                alt={auction.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                 <span className="text-white font-bold flex items-center gap-2">
                   <Clock size={16} />
                   {new Date(auction.endTime).toLocaleDateString()}
                 </span>
              </div>
           </div>

           <div>
              <h1 className="text-4xl font-bold gradient-text mb-4">{auction.title}</h1>
              <p className="text-gray-400 leading-relaxed text-lg">{auction.description}</p>
           </div>
        </div>

        {/* Right: Bidding Panel */}
        <div className="space-y-8">
           <Card className="p-8 border-white/10 bg-white/5">
              <div className="flex justify-between items-start mb-8">
                 <div>
                    <p className="text-gray-400 text-sm mb-1">Current Highest Bid</p>
                    <div className="text-5xl font-black text-white flex items-center">
                       <span className="text-white text-3xl mr-1">$</span>
                       {currentBid.toLocaleString()}
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-gray-400 text-sm mb-1">Total Bids</p>
                    <p className="text-2xl font-bold text-white">{bidsList.length}</p>
                 </div>
              </div>

              {auction.status === "ACTIVE" ? (
                 <form onSubmit={handlePlaceBid} className="space-y-4">
                    <div className="bg-black/40 p-4 rounded-xl border border-white/10 mb-4">
                       <p className="text-sm text-gray-400 mb-2">Instant Quick Bid</p>
                       <div className="flex gap-2">
                          {[currentBid + 100, currentBid + 500, currentBid + 1000].map(amt => (
                             <button
                               key={amt}
                               type="button"
                               onClick={() => setBidAmount(amt)}
                               className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors border border-white/5"
                             >
                               ${amt.toLocaleString()}
                             </button>
                          ))}
                       </div>
                    </div>

                    <div className="flex gap-4">
                       <div className="relative flex-grow">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                          <input 
                             type="number"
                             value={bidAmount}
                             onChange={(e) => setBidAmount(e.target.value)}
                             placeholder={`Min $${(minBid).toLocaleString()}`}
                             className="w-full bg-black/50 border border-white/20 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:border-white transition-colors"
                          />
                       </div>
                       <Button 
                          type="submit" 
                          variant="primary" 
                          disabled={placingBid}
                          className="px-8 bg-white hover:bg-gray-200 text-black font-bold"
                       >
                          {placingBid ? "..." : "Bid"}
                       </Button>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                 </form>
              ) : (
                <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400 font-bold">
                   Auction Ended
                </div>
              )}
           </Card>

           <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <TrendingUp className="text-white" /> Bid History
              </h3>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                 {bidsList.length > 0 ? bidsList.map((bid, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors border-b border-white/5 last:border-0">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-xs">
                             <User size={14} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white">Bidder</p>
                             <p className="text-xs text-gray-500">{new Date(bid.time).toLocaleTimeString()}</p>
                          </div>
                       </div>
                       <span className="font-mono text-white font-bold">
                          ${bid.amount.toLocaleString()}
                       </span>
                    </div>
                 )) : (
                    <p className="text-center text-gray-500 py-4">No bids yet. Be the first!</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
