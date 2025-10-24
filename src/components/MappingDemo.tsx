import { useState } from "react";
import { ArrowRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import mappingVisual from "@/assets/mapping-visual.jpg";

const exampleMappings = [
  {
    tradmed: "Jwara (ज्वर)",
    system: "Ayurveda",
    icd11: "MG26 - Fever of unknown origin",
    confidence: 92,
    reasoning: "Fever disorders mapping based on symptom correlation and traditional diagnostic principles",
    alternatives: ["1F00 - Fever patterns", "1F01 - Pyrexia"],
  },
  {
    tradmed: "Atisara (अतिसार)",
    system: "Ayurveda", 
    icd11: "DA92.0 - Infectious diarrhea",
    confidence: 87,
    reasoning: "Diarrhea mapping with consideration of infectious disease etiology and digestive system involvement",
    alternatives: ["DA92.1 - Acute diarrhea", "DA92.2 - Chronic diarrhea"],
  },
  {
    tradmed: "Vata Prakopa",
    system: "Ayurveda",
    icd11: "ME64 - Movement disorders",
    confidence: 78,
    reasoning: "Vata imbalance correlates with neurological and movement dysfunction in modern classification",
    alternatives: ["8A00 - Nervous system disorders", "FA0Z - Musculoskeletal symptoms"],
  },
];

export const MappingDemo = () => {
  const [selectedMapping, setSelectedMapping] = useState(0);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 gap-2 bg-secondary/20 text-secondary border-secondary/30">
            <Sparkles className="w-3 h-3" />
            Live Demo
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">See </span>
            <span className="gradient-text">AI Mapping</span>
            <span className="text-foreground"> in Action</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Watch how our AI seamlessly translates traditional medicine terms to modern ICD-11 codes
          </p>
        </div>

        {/* Demo Interface */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
              <img 
                src={mappingVisual} 
                alt="AI Mapping Visualization" 
                className="relative z-10 rounded-2xl shadow-2xl"
              />
            </div>

            {/* Right: Mapping Cards */}
            <div className="space-y-4">
              {exampleMappings.map((mapping, index) => (
                <Card
                  key={index}
                  onClick={() => setSelectedMapping(index)}
                  className={`glass p-6 cursor-pointer transition-all duration-300 ${
                    selectedMapping === index 
                      ? 'ring-2 ring-primary glow scale-[1.02]' 
                      : 'hover:ring-1 hover:ring-primary/50'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-foreground">
                          {mapping.tradmed}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {mapping.system}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-primary" />
                        <code className="text-sm font-mono text-secondary">
                          {mapping.icd11}
                        </code>
                      </div>
                    </div>
                    
                    {/* Confidence Badge */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-primary">
                        {mapping.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedMapping === index && (
                    <div className="mt-4 pt-4 border-t border-border/50 space-y-3 animate-fade-in">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-secondary" />
                          <span className="text-sm font-semibold text-muted-foreground">
                            AI Reasoning
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {mapping.reasoning}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Alternative Mappings
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {mapping.alternatives.map((alt, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {alt}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
              
              <Button className="w-full gap-2 h-12" size="lg">
                Try Full Mapping Tool
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
