import Header from "../components/home/Header";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import Templates from "../components/home/Templates";
import Showcase from "../components/home/Showcase";
import Testimonials from "../components/home/Testimonials";
import CTA from "../components/home/CTA";
import Footer from "../components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f8f5eb] text-[#173d32]">
      <Header />

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Templates />
        <Showcase />
        <Testimonials />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}