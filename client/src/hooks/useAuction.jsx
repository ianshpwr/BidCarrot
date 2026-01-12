import { useEffect, useState } from "react";
import supabase from "@/Components/Supabase/Client";

export default function useAuctions(id = null) {
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);
  const [pastAuctions, setPastAuctions] = useState([]);
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuctions() {
      if (id) {
        const { data, error } = await supabase
          .from("Auctions")
          .select("*")
          .eq("id", id)
          .single();

        if (!error) setAuction(data);
      } else {
        const { data, error } = await supabase.from("Auctions").select("*");
        if (error) {
          console.error("Error fetching auctions:", error);
          return;
        }

        setLiveAuctions(data.filter((a) => a?.Status === "Live"));
        setUpcomingAuctions(data.filter((a) => a?.Status === "Upcoming"));
        setPastAuctions(data.filter((a) => a?.Status === "Recent"));
      }

      setLoading(false);
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
