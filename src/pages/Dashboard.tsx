import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileUp, Zap, Code2, LogOut } from "lucide-react";
import { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ mappings: 0, accuracy: 0 });
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
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    const { data } = await supabase
      .from('mappings')
      .select('confidence_score')
      .eq('user_id', user?.id);
    
    if (data) {
      const avgConfidence = data.length > 0
        ? data.reduce((sum, m) => sum + Number(m.confidence_score), 0) / data.length
        : 0;
      setStats({
        mappings: data.length,
        accuracy: Math.round(avgConfidence * 100)
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-text">Ayurveda-Bridge AI</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Welcome Banner */}
        <div className="glass p-8 rounded-3xl mb-8 glow">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{user.user_metadata?.full_name || 'Practitioner'}</span>!
          </h2>
          <p className="text-muted-foreground text-lg">
            Ready to bridge ancient wisdom with modern healthcare?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass p-6 rounded-2xl">
            <div className="text-4xl font-bold gradient-text mb-2">{stats.mappings}</div>
            <p className="text-muted-foreground">Total Mappings</p>
          </div>
          <div className="glass p-6 rounded-2xl">
            <div className="text-4xl font-bold gradient-text mb-2">{stats.accuracy}%</div>
            <p className="text-muted-foreground">Average Confidence</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/mapping")}
            className="glass p-8 rounded-2xl text-left hover:glow transition-all group"
          >
            <Zap className="w-12 h-12 mb-4 text-primary group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Quick Mapping</h3>
            <p className="text-muted-foreground mb-4">
              Map TRADMED terms to ICD-11 instantly
            </p>
            <div className="flex items-center text-primary">
              Start Mapping <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </button>

          <button
            onClick={() => navigate("/knowledge")}
            className="glass p-8 rounded-2xl text-left hover:glow transition-all group"
          >
            <FileUp className="w-12 h-12 mb-4 text-secondary group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Knowledge Base</h3>
            <p className="text-muted-foreground mb-4">
              Explore TRADMED concepts and mappings
            </p>
            <div className="flex items-center text-primary">
              Explore <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </button>

          <button
            onClick={() => navigate("/analytics")}
            className="glass p-8 rounded-2xl text-left hover:glow transition-all group"
          >
            <Code2 className="w-12 h-12 mb-4 text-accent group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Analytics</h3>
            <p className="text-muted-foreground mb-4">
              View your mapping statistics and insights
            </p>
            <div className="flex items-center text-primary">
              View Analytics <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
