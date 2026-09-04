import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import SearchBar from "../components/SearchBar";
import ProductGrid from "../components/ProductGrid";
import SaleCarousel from "../components/SaleCarousel";
import WhyChooseUs from "../components/WhyChooseUs";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="app-shell">
      <Hero />
      <SearchBar />
      <CategorySection />
      <SaleCarousel />
      <ProductGrid />
      <WhyChooseUs />
      <CTA />
      <Footer />
    </main>
  );
}
