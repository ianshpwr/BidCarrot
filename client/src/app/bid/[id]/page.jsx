import AuctionDetailClient from "./AuctionDetailClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auctions/${id}`);
    if (!res.ok) {
        return {
            title: "Auction Not Found | BidCarrot",
            description: "The requested auction could not be found."
        };
    }
    
    const auction = await res.json();
    return {
      title: `${auction.title} | BidCarrot`,
      description: auction.description ? auction.description.substring(0, 160) : "Join the bidding on BidCarrot.",
      openGraph: {
        title: auction.title,
        description: auction.description ? auction.description.substring(0, 160) : "Join the bidding.",
      }
    };
  } catch (error) {
    return {
      title: "BidCarrot Auction",
      description: "Premium online auctions."
    };
  }
}

export default async function BidPage({ params }) {
  const { id } = await params;
  return <AuctionDetailClient id={id} />;
}
