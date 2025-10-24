import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface Concept {
  id: string;
  system: string;
  title: string;
  description: string;
  related_codes: any;
  confidence: number;
}

const Knowledge = () => {
  const [user, setUser] = useState<User | null>(null);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [filteredConcepts, setFilteredConcepts] = useState<Concept[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    loadConcepts();
  }, []);

  useEffect(() => {
    let filtered = concepts;
    
    if (selectedSystem) {
      filtered = filtered.filter(c => c.system === selectedSystem);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredConcepts(filtered);
  }, [searchQuery, selectedSystem, concepts]);

  const loadConcepts = async () => {
    const { data } = await supabase
      .from('knowledge_concepts')
      .select('*')
      .order('system', { ascending: true });
    
    if (data) {
      setConcepts(data);
      setFilteredConcepts(data);
    }
  };

  const systems = ['Ayurveda', 'Siddha', 'Unani', 'Yoga'];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold gradient-text">Knowledge Base</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts..."
              className="glass pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedSystem === null ? "default" : "outline"}
              onClick={() => setSelectedSystem(null)}
              size="sm"
            >
              All Systems
            </Button>
            {systems.map(sys => (
              <Button
                key={sys}
                variant={selectedSystem === sys ? "default" : "outline"}
                onClick={() => setSelectedSystem(sys)}
                size="sm"
              >
                {sys}
              </Button>
            ))}
          </div>
        </div>

        {/* Concepts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConcepts.map(concept => (
            <div key={concept.id} className="glass p-6 rounded-2xl space-y-4">
              <div>
                <div className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm mb-3">
                  {concept.system}
                </div>
                <h3 className="text-xl font-bold mb-2">{concept.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {concept.description}
                </p>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Related ICD-11 Codes</div>
                <div className="flex flex-wrap gap-2">
                  {concept.related_codes.map((code, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-secondary/20 text-secondary rounded text-xs font-mono"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <span className="text-sm text-muted-foreground">Confidence</span>
                <span className="font-bold text-primary">
                  {Math.round((concept.confidence || 0) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredConcepts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-muted-foreground">No concepts found matching your search</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Knowledge;
