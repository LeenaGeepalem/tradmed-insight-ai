import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@supabase/supabase-js";
import { Loader2, ArrowLeft, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MappingResult {
  icd11_code: string;
  icd11_title: string;
  confidence_score: number;
  reasoning: string;
  alternatives?: Array<{ code: string; title: string }>;
}

const Mapping = () => {
  const [user, setUser] = useState<User | null>(null);
  const [inputText, setInputText] = useState("");
  const [system, setSystem] = useState("Ayurveda");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MappingResult | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleMap = async () => {
    if (!inputText.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a TRADMED term" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('map-tradmed', {
        body: { tradmedTerm: inputText, system }
      });

      if (error) throw error;

      setResult(data as MappingResult);

      // Save to database
      await supabase.from('mappings').insert({
        user_id: user?.id,
        tradmed_term: inputText,
        tradmed_system: system,
        icd11_code: data.icd11_code,
        icd11_title: data.icd11_title,
        confidence_score: data.confidence_score,
        reasoning: data.reasoning,
        alternatives: data.alternatives || []
      });

      toast({ title: "Success!", description: "Mapping completed successfully" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const downloadFHIR = () => {
    if (!result) return;

    const fhirBundle = {
      resourceType: "Bundle",
      type: "collection",
      entry: [{
        resource: {
          resourceType: "Condition",
          code: {
            coding: [{
              system: "http://id.who.int/icd11/mms",
              code: result.icd11_code,
              display: result.icd11_title
            }]
          },
          meta: {
            tag: [{
              system: "http://tradmed.org/systems",
              code: system,
              display: `${system} - ${inputText}`
            }]
          },
          extension: [{
            url: "http://tradmed.org/confidence",
            valueDecimal: result.confidence_score
          }]
        }
      }]
    };

    const blob = new Blob([JSON.stringify(fhirBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fhir-bundle-${result.icd11_code}.json`;
    a.click();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold gradient-text">TRADMED-ICD-11 Mapping Tool</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Traditional Medicine System</label>
                <Select value={system} onValueChange={setSystem}>
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ayurveda">Ayurveda</SelectItem>
                    <SelectItem value="Siddha">Siddha</SelectItem>
                    <SelectItem value="Unani">Unani</SelectItem>
                    <SelectItem value="Yoga">Yoga</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">TRADMED Term</label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter traditional medicine term, symptoms, or condition..."
                  className="glass min-h-[200px]"
                />
              </div>

              <Button onClick={handleMap} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze & Map'
                )}
              </Button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {result && (
              <>
                <div className="glass p-6 rounded-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">Mapping Result</h3>
                    <Button variant="outline" size="sm" onClick={downloadFHIR}>
                      <Download className="w-4 h-4 mr-2" />
                      FHIR
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground">ICD-11 Code</div>
                      <div className="text-2xl font-bold text-primary">{result.icd11_code}</div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">Title</div>
                      <div className="font-medium">{result.icd11_title}</div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">Confidence Score</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-secondary/20 rounded-full h-2">
                          <div 
                            className="bg-gradient-primary h-2 rounded-full transition-all"
                            style={{ width: `${result.confidence_score * 100}%` }}
                          />
                        </div>
                        <span className="font-bold">{Math.round(result.confidence_score * 100)}%</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Reasoning</div>
                      <div className="text-sm bg-background/50 p-4 rounded-lg">
                        {result.reasoning}
                      </div>
                    </div>

                    {result.alternatives && result.alternatives.length > 0 && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Alternative Mappings</div>
                        <div className="space-y-2">
                          {result.alternatives.map((alt, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm bg-background/50 p-3 rounded-lg">
                              <span className="font-mono text-primary">{alt.code}</span>
                              <span>-</span>
                              <span>{alt.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {!result && (
              <div className="glass p-12 rounded-2xl text-center">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-muted-foreground">
                  Enter a TRADMED term to see the AI mapping results
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Mapping;
