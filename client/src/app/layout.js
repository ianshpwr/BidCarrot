import "./globals.css";
import Navbarr from '@/Components/Navbar';
import { AuthProvider } from "@/context/AuthContext";
import ErrorBoundary from "@/Components/ErrorBoundary";
import { Toaster } from "sonner";

export const metadata = {
  title: "BidCarrot",
  description: "Premium Auction Platform",
  icons: {
    icon: "/auction.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbarr />
              <main className="flex-grow pt-28">
                {children}
              </main>
              <Toaster position="top-center" richColors />
            </div>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
