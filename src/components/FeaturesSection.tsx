import { Brain, Database, Activity, Shield, ArrowLeftRight, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Mapping",
    description: "Advanced NLP models semantically align TRADMED terminology with ICD-11 disease entities using Google Gemini AI",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "FHIR Compliance",
    description: "Generate standards-compliant HL7-FHIR resources for seamless EHR, HIS, and healthcare ecosystem integration",
    color: "text-secondary",
  },
  {
    icon: ArrowLeftRight,
    title: "Bidirectional Translation",
    description: "Support both TRADMED → ICD-11 and ICD-11 → TRADMED translations for comprehensive research capabilities",
    color: "text-accent",
  },
  {
    icon: Activity,
    title: "Context-Aware Reasoning",
    description: "Employ probabilistic reasoning to infer relationships between traditional diagnostics and biomedical classifications",
    color: "text-primary",
  },
  {
    icon: Database,
    title: "Ontology Mapping Engine",
    description: "Sophisticated semantic alignment of Ayurveda, Siddha, Unani concepts with international disease standards",
    color: "text-secondary",
  },
  {
    icon: BarChart3,
    title: "Audit & Traceability",
    description: "Complete transparency with confidence scores, reasoning chains, and explainable AI-based decision logging",
    color: "text-accent",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Powerful Features</span>
            <br />
            <span className="text-foreground">for Healthcare Integration</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Enterprise-grade AI capabilities designed for seamless traditional medicine integration
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glass p-8 hover:glow transition-all duration-300 group cursor-pointer border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${feature.color.replace('text-', '')}/20 to-${feature.color.replace('text-', '')}/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:gradient-text transition-all">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
