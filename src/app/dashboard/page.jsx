"use client";

import { useEffect, useState } from "react";
import Footer from "@/Components/Landingpage/Footer";
import "./dashboard.css";
import  supabase  from "@/Components/Supabase/Client";

async function fetchAuctions() {
  const { data, error } = await supabase.from("Auctions").select("*");

  if (error) {
    console.error("Error fetching auctions:", error);
    return [];
  }
  return data;
}

function Dashboard() {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    async function loadData() {
      const data = await fetchAuctions();
      setAuctions(data);
    }

    loadData();
  }, []);

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
        <div className="lis">
          <h4>Time</h4>
          <span>
            {auction?.Timestamp
              ? new Date(auction.Timestamp).toLocaleString()
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );

  const activeAuctions = auctions.filter((a) => a?.Status === "Live");
  const upcomingAuctions = auctions.filter((a) => a?.Status === "Upcoming");
  const pastAuctions = auctions.filter((a) => a?.Status === "Recent");

  return (
    <div className="dashboard">
      <h1>Welcome back! Here's your auction activity</h1>

      <div className="databar">
        <div className="databarli">Active Bids</div>
        <div className="databarli">Total Spent</div>
        <div className="databarli">Auctions Won</div>
        <div className="databarli">Success Rate</div>
      </div>

      <div className="datacontainer">
        <div className="data">
          <h2>Active Auctions</h2>
          {activeAuctions.length > 0 ? (
            activeAuctions.map(renderAuctionCard)
          ) : (
            <p>No active auctions</p>
          )}
        </div>

        <div className="data">
          <h2>Upcoming Bids</h2>
          {upcomingAuctions.length > 0 ? (
            upcomingAuctions.map(renderAuctionCard)
          ) : (
            <p>No upcoming auctions</p>
          )}
        </div>
      </div>

      <div className="cta-buttons">
        <button>Create New Auction</button>
        <button>Browse Auctions</button>
      </div>

      <div className="pastdata">
        <h2>Past Auctions</h2>
        {pastAuctions.length > 0 ? (
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
