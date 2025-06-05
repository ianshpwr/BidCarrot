import Navbar from '@/Components/Navbar';
import Landingpage from '@/Components/Landingpage/Landingpage';
import FeaturesSection from '@/Components/ui/Bentogrid';
import Footer from '@/Components/Landingpage/Footer';

export default function Home() {
  return (
    <>
    <div>
      <Landingpage />
      <FeaturesSection />
      <Footer />

    </div>
    </>
  );
}
