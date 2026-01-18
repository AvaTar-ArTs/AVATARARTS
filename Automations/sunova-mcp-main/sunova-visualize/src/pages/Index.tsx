import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BetaCallout from "@/components/BetaCallout";
import ProcessSection from "@/components/ProcessSection";
import FeaturesSection from "@/components/FeaturesSection";
import ParallaxSection from "@/components/ParallaxSection";
import ExamplesSection from "@/components/ExamplesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1c1c1f' }}>
      <Header />
      <main>
        <Hero />
        <BetaCallout />
        <ProcessSection />
        <ParallaxSection />
        <FeaturesSection />
        <ExamplesSection />
        <TestimonialsSection />
        <PricingSection />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
