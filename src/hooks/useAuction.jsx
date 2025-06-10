import { useEffect, useState } from "react";
import supabase from "@/Components/Supabase/Client";

export default function useAuctions() {
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);
  const [pastAuctions, setPastAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuctions() {
      const { data, error } = await supabase.from("Auctions").select("*");
      if (error) {
        console.error("Error fetching auctions:", error);
        setLoading(false);
        return;
      }

      setLiveAuctions(data.filter((a) => a?.Status === "Live"));
      setUpcomingAuctions(data.filter((a) => a?.Status === "Upcoming"));
      setPastAuctions(data.filter((a) => a?.Status === "Recent"));
      setLoading(false);
    }

    fetchAuctions();
  }, []);

  return { liveAuctions, upcomingAuctions, pastAuctions, loading };
}
