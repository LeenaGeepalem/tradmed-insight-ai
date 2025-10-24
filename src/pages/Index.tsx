import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { MappingDemo } from "@/components/MappingDemo";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <MappingDemo />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
