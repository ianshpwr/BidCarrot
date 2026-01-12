"use client";

import { useEffect } from "react";
import Footer from "@/Components/Landingpage/Footer";
import "./dashboard.css";
import Link from "next/link";
import useAuctions from "@/hooks/useAuction";

function Dashboard() {
  const { liveAuctions, upcomingAuctions, pastAuctions, loading } = useAuctions();

  const renderAuctionCard = (auction) => (
    <div className="datacontainerli" key={auction.id}>
      <div className="liss">
        <h3>{auction?.Item}</h3>
        <span>{auction?.TimeInfo}</span>
      </div>
      <div className="des">
        <div className="lis">
          <p>Current Bid</p>
          <span>{auction?.CurrentBid}</span>
        </div>
        <div className="lis">
          <h4>Bidders</h4>
          <span>{auction?.Bidders}</span>
        </div>
        <div className="lis">
          <h4>Status</h4>
          <span>{auction?.Status}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <h1>Welcome back! Here's your auction activity</h1>

      <div className="databar">
        <div className="databarli">Active Bids</div>
        <div className="databarli">Total Spent</div>
        <div className="databarli">Auctions Won</div>
        <div className="databarli">Success Rate</div>
      </div>
      
      <div className="cta-buttons">
        <Link href="/createauction"><button>Create New Auction</button></Link>
        <Link href="/auction"><button>Browse Auctions</button></Link>
      </div>
      <div className="pastdata">
        <h2>Past Auctions</h2>
        {loading ? (
          <p>Loading auctions...</p>
        ) : pastAuctions.length > 0 ? (
          pastAuctions.map(renderAuctionCard)
        ) : (
          <p>No past auctions</p>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
