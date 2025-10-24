import { ArrowRight, Activity, Database, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </div>
      
      {/* Hero Image with overlay */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroImage} 
          alt="Ayurveda Bridge AI" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">AI-Powered Healthcare Integration</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Bridging Ancient Wisdom</span>
            <br />
            <span className="text-foreground">with Modern Medicine</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            AI-powered TRADMED to ICD-11 mapping with FHIR compliance for seamless healthcare integration
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="gap-2 text-lg h-14 px-8">
              Start Mapping <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-lg h-14 px-8 glass">
              View API Docs
            </Button>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="glass p-6 rounded-2xl backdrop-blur-xl hover:glow transition-all">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Database className="w-6 h-6 text-primary" />
                <span className="text-4xl font-bold gradient-text">1,250+</span>
              </div>
              <p className="text-muted-foreground">Terms Mapped</p>
            </div>
            
            <div className="glass p-6 rounded-2xl backdrop-blur-xl hover:glow transition-all">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Activity className="w-6 h-6 text-secondary" />
                <span className="text-4xl font-bold gradient-text">94.3%</span>
              </div>
              <p className="text-muted-foreground">Accuracy Rate</p>
            </div>
            
            <div className="glass p-6 rounded-2xl backdrop-blur-xl hover:glow transition-all">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-accent" />
                <span className="text-4xl font-bold gradient-text">89</span>
              </div>
              <p className="text-muted-foreground">Active Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full p-1">
          <div className="w-1.5 h-3 bg-primary rounded-full mx-auto animate-pulse-slow" />
        </div>
      </div>
    </section>
  );
};
