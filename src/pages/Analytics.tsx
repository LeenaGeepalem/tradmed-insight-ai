import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface Mapping {
  id: string;
  tradmed_term: string;
  tradmed_system: string;
  icd11_code: string;
  confidence_score: number;
  created_at: string;
}

const Analytics = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    avgConfidence: 0,
    bySystem: {} as Record<string, number>
  });
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
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    const { data } = await supabase
      .from('mappings')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (data) {
      setMappings(data);
      
      const avgConf = data.length > 0
        ? data.reduce((sum, m) => sum + Number(m.confidence_score), 0) / data.length
        : 0;

      const bySystem = data.reduce((acc, m) => {
        acc[m.tradmed_system] = (acc[m.tradmed_system] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setStats({
        total: data.length,
        avgConfidence: avgConf,
        bySystem
      });
    }
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
          <h1 className="text-2xl font-bold gradient-text">Analytics Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass p-6 rounded-2xl">
            <div className="text-4xl font-bold gradient-text mb-2">{stats.total}</div>
            <p className="text-muted-foreground">Total Mappings</p>
          </div>
          <div className="glass p-6 rounded-2xl">
            <div className="text-4xl font-bold gradient-text mb-2">
              {Math.round(stats.avgConfidence * 100)}%
            </div>
            <p className="text-muted-foreground">Average Confidence</p>
          </div>
          <div className="glass p-6 rounded-2xl">
            <div className="text-4xl font-bold gradient-text mb-2">
              {Object.keys(stats.bySystem).length}
            </div>
            <p className="text-muted-foreground">Systems Used</p>
          </div>
        </div>

        {/* System Distribution */}
        <div className="glass p-6 rounded-2xl mb-8">
          <h3 className="text-xl font-bold mb-4">Mappings by System</h3>
          <div className="space-y-4">
            {Object.entries(stats.bySystem).map(([system, count]) => (
              <div key={system}>
                <div className="flex justify-between mb-2">
                  <span>{system}</span>
                  <span className="font-bold">{count}</span>
                </div>
                <div className="bg-secondary/20 rounded-full h-2">
                  <div
                    className="bg-gradient-primary h-2 rounded-full transition-all"
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Mappings */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4">Recent Mappings</h3>
          <div className="space-y-4">
            {mappings.slice(0, 10).map(mapping => (
              <div key={mapping.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{mapping.tradmed_term}</div>
                  <div className="text-sm text-muted-foreground">
                    {mapping.tradmed_system} → {mapping.icd11_code}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">
                    {Math.round(Number(mapping.confidence_score) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(mapping.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {mappings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-muted-foreground">No mappings yet. Start mapping to see analytics!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Analytics;
