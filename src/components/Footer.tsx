import { Heart, Github, Linkedin, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold gradient-text mb-3">
              AYURVEDA-BRIDGE AI
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Bridging ancient Indian medicine with modern healthcare standards through AI-powered integration.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:glow transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:glow transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:glow transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Demo</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Guides</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 AYURVEDA-BRIDGE AI. Built for SAMARTHA 2025 Hackathon.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for Healthcare Innovation
          </p>
        </div>
      </div>
    </footer>
  );
};
