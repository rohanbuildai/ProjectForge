import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import ProductPreview from "../components/landing/ProductPreview";
import Features from "../components/landing/Features";
import ProductShowcase from "../components/landing/ProductShowcase";
import Collaboration from "../components/landing/Collaboration";
import AIFuture from "../components/landing/AIFuture";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

function Home() {
  return (
    <div id="top">
      <Navbar />
      <main>
        <Hero />
        <ProductPreview />
        <Features />
        <ProductShowcase />
        <Collaboration />
        <AIFuture />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default Home;