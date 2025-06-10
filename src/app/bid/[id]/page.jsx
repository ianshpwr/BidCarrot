"use client";
import "./bid.css";
import { useParams } from "next/navigation";
import Link from "next/link";
import useAuctions from "@/hooks/useAuction";
import "@/app/dashboard/dashboard.css";
import { useState } from "react";

export default function AuctionDetailPage() {
  const { id } = useParams();
  const { auction, loading } = useAuctions(id);
  const [bidAmount, setBidAmount] = useState("");
  const quickBids = [2550000, 2600000, 2750000];

  const handleQuickBid = (amount) => setBidAmount(amount);

  if (loading || !auction) return <div className="dashboard">Loading...</div>;

  return (
    <div className="dashboard">
      <Link href="/auction" className="back-button">⬅ Back to Auctions</Link>

      <div className="auction-detail-container">
        <div className="auction-info">

          <h1 className="title">{auction.Item}</h1>
          <p className="description">{auction.Description || "No description available."}</p>

          <div className="auction-image-placeholder" />

          <div className="auction-stats">
            <div>
              <p>Current Bid</p>
              <h3>${Number(auction.CurrentBid).toLocaleString()}</h3>
            </div>
            <div>
              <p>Time Left</p>
              <h3> {auction.TimeInfo}</h3>
            </div>
            <div>
              <p>Total Bids</p>
              <h3>{auction.TotalBids || "47"}</h3>
            </div>
            <div>
              <p>Participants</p>
              <h3>{auction.Bidders || "23"}</h3>
            </div>
          </div>

          <div className="recent-bids">
            <h2>Recent Bids</h2>
            <p>No recent bids</p>
          </div>
        </div>

        <div className="bid-panel">
          <h2>Place Your Bid</h2>

          <div className="min-bid-box">
            <p>Minimum Bid</p>
            <h1>${Number(auction.CurrentBid + 50000).toLocaleString()}</h1>
          </div>

          <label>Your Bid Amount ($)</label>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="Enter bid amount"
            className="bid-input"
          />

          <div className="quick-bids">
            {quickBids.map((amount) => (
              <button
                key={amount}
                onClick={() => handleQuickBid(amount)}
                className="quick-bid-btn"
              >
                ${amount.toLocaleString()}
              </button>
            ))}
          </div>

          <button className="place-bid-button">Place Bid</button>

          <ul className="bid-rules">
            <li>Bids are binding and cannot be withdrawn</li>
            <li>A 2.5% platform fee applies to winning bids</li>
            <li>Payment is due within 24 hours of auction end</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
