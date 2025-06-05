import Navbar from '@/Components/Navbar';
import Landingpage from '@/Components/Landingpage/Landingpage';
import FeaturesSection from '@/Components/ui/Bentogrid';
import Footer from '@/Components/Landingpage/Footer';
import CardHoverEffect from '@/Components/Landingpage/Testemonials';
import Stats from '@/Components/ui/Stats';


export default function Home() {
  return (
    <>
    <div>
      <Landingpage />
      <FeaturesSection />
      <Stats />
<div className="text-center px-4 sm:px-6 lg:px-8 py-10 ">
  <h3 className="text-white text-2xl sm:text-3xl font-semibold mb-3">
    What Our Users Say
  </h3>
  <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto">
    Trusted by thousands of bidders and sellers worldwide
  </p>
</div>

      <CardHoverEffect />

      <Footer />

    </div>
    </>
  );
}
