import { ArrowRight, BookOpen, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-primary opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <div className="glass p-12 rounded-3xl text-center glow">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Ready to </span>
              <span className="gradient-text">Bridge the Gap?</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start integrating traditional medicine with modern healthcare standards today
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2 text-lg h-14 px-8" asChild>
                <a href="/auth">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-lg h-14 px-8 glass" asChild>
                <a href="/knowledge">
                  <BookOpen className="w-5 h-5" />
                  Documentation
                </a>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-lg h-14 px-8 glass" asChild>
                <a href="/mapping">
                  <Code2 className="w-5 h-5" />
                  API Reference
                </a>
              </Button>
            </div>
          </div>

          {/* Support Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-6 glass rounded-2xl">
              <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">Support Available</p>
            </div>
            <div className="text-center p-6 glass rounded-2xl">
              <div className="text-3xl font-bold gradient-text mb-2">FHIR</div>
              <p className="text-sm text-muted-foreground">Compliant APIs</p>
            </div>
            <div className="text-center p-6 glass rounded-2xl">
              <div className="text-3xl font-bold gradient-text mb-2">100%</div>
              <p className="text-sm text-muted-foreground">Open Source</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
