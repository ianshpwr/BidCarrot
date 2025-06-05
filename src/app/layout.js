import "./globals.css";
import Navbarr from '@/Components/Navbar';

export const metadata = {
  title: "BidCarrot",
  description: "Auction Platform",
  icons: {
    icon: "/auction.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
          <Navbarr />
        {children}
      </body>
    </html>
  );
}
