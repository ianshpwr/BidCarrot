import { useEffect, useState } from "react";
import { auctions } from "@/lib/api";

export default function useAuctions(id = null) {
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);
  const [pastAuctions, setPastAuctions] = useState([]);
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuctions() {
      try {
        if (id) {
          const response = await auctions.getOne(id);
          setAuction(response.data);
        } else {
          const response = await auctions.getAll();
          const data = response.data;
          
          // Ensure data is an array before filtering
          const auctionsList = Array.isArray(data) ? data : (data.auctions || []);

          // Backend uses 'ACTIVE', 'ENDED', etc.
          // Mapping 'ACTIVE' to liveAuctions. 
          // Note: Backend getActive only returns ACTIVE, so others might be empty.
          setLiveAuctions(auctionsList.filter((a) => a?.status === "ACTIVE"));
          setUpcomingAuctions(auctionsList.filter((a) => a?.status === "UPCOMING" || a?.status === "PENDING")); 
          setPastAuctions(auctionsList.filter((a) => a?.status === "ENDED" || a?.status === "COMPLETED"));
        }
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAuctions();
  }, [id]);

  return {
    liveAuctions,
    upcomingAuctions,
    pastAuctions,
    auction,
    loading,
  };
}
