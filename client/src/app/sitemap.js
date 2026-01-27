import env from "@/lib/env";

export default async function sitemap() {
  const baseUrl = "https://bidcarrot.vercel.app";
  
  // Static routes
  const routes = [
    "",
    "/login",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  }));

  try {
    // Fetch active auctions for dynamic routes
    // We use fetch directly to avoid axios/auth issues on server if any
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/auctions/active`, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error("Failed to fetch auctions");
    
    const auctions = await response.json();
    
    const auctionRoutes = auctions.map((auction) => ({
      url: `${baseUrl}/bid/${auction.id}`,
      lastModified: new Date(auction.createdAt || new Date()),
      changeFrequency: 'hourly',
      priority: 0.8,
    }));

    return [...routes, ...auctionRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return routes;
  }
}
