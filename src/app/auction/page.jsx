"use client";

import React from "react";
import useAuctions from "@/hooks/useAuction";
import "./../dashboard/dashboard.css";
import Link from "next/link";

function Auction() {
  const { liveAuctions, upcomingAuctions, loading } = useAuctions();

  const renderAuctionCard = (auction) => (
    <div className="datacontainerli" key={auction.id}>
      <div className="liss">
        <h3>{auction?.Item}</h3>
        <span>{auction?.TimeInfo}</span>
      </div>
      <div className="des">
        <div className="lis">
          <p>Current Bid</p>
          <span>${Number(auction?.CurrentBid).toLocaleString()}</span>
        </div>
        <div className="lis">
          <h4>Bidders</h4>
          <span>{auction?.Bidders}</span>
        </div>
        <div className="lis">
          <h4>Status</h4>
          <span>{auction?.Status}</span>
        </div>
        <div className="lis">
          <h4>Time</h4>
          <span>
            {auction?.Timestamp
              ? new Date(auction.Timestamp).toLocaleString()
              : "N/A"}
          </span>
        </div>
      </div>

      <div className="auction-actions">
        <Link href={`/bid/${auction.id}`}>
          <button className="bid-now-button">Bid Now</button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      {loading ? (
        <p>Loading auctions...</p>
      ) : (
        <>
          <div className="data">
            <h2>Live Auctions</h2>
            {liveAuctions.length > 0 ? (
              liveAuctions.map(renderAuctionCard)
            ) : (
              <p>No live auctions available.</p>
            )}
          </div>

          <div className="data">
            <h2>Upcoming Auctions</h2>
            {upcomingAuctions.length > 0 ? (
              upcomingAuctions.map(renderAuctionCard)
            ) : (
              <p>No upcoming auctions available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Auction;
