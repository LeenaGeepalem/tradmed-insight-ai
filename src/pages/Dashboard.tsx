import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  ArrowRight,
  Activity,
  Database,
  FileUp,
  BarChart2,
  Search,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Chart } from "@/components/ui/line-chart";

interface DashboardStats {
  totalMappings: number;
  avgConfidence: number;
  systemBreakdown: Record<string, number>;
  recentMappings: any[];
  accuracyTrend: Array<{ date: string; accuracy: number }>;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalMappings: 0,
    avgConfidence: 0,
    systemBreakdown: {},
    recentMappings: [],
    accuracyTrend: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/auth");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    const { data: mappings } = await supabase
      .from('mappings')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (mappings) {
      const systemBreakdown = mappings.reduce((acc, m) => ({
        ...acc,
        [m.tradmed_system]: (acc[m.tradmed_system] || 0) + 1
      }), {} as Record<string, number>);

      const avgConfidence = mappings.reduce((sum, m) => sum + Number(m.confidence_score), 0) / mappings.length;

      // Calculate accuracy trend
      const accuracyByDate = mappings.reduce((acc, m) => {
        const date = new Date(m.created_at).toLocaleDateString();
        if (!acc[date]) acc[date] = { sum: 0, count: 0 };
        acc[date].sum += Number(m.confidence_score);
        acc[date].count++;
        return acc;
      }, {} as Record<string, { sum: number; count: number }>);

      const accuracyTrend = Object.entries(accuracyByDate)
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        .map(([date, { sum, count }]) => ({
          date,
          accuracy: sum / count
        }));

      setStats({
        totalMappings: mappings.length,
        avgConfidence,
        systemBreakdown,
        recentMappings: mappings.slice(0, 5),
        accuracyTrend
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
            <Button onClick={() => navigate("/mapping")} variant="default">
              New Mapping <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <Activity className="h-8 w-8 mb-4 text-primary" />
            <h3 className="text-2xl font-bold">{stats.totalMappings}</h3>
            <p className="text-muted-foreground">Total Mappings</p>
          </Card>

          <Card className="p-6">
            <Database className="h-8 w-8 mb-4 text-secondary" />
            <h3 className="text-2xl font-bold">{Math.round(stats.avgConfidence * 100)}%</h3>
            <p className="text-muted-foreground">Average Confidence</p>
          </Card>

          <Card className="p-6">
            <Search className="h-8 w-8 mb-4 text-accent" />
            <h3 className="text-2xl font-bold">
              {Object.keys(stats.systemBreakdown).length}
            </h3>
            <p className="text-muted-foreground">Systems Mapped</p>
          </Card>

          <Card className="p-6">
            <Settings className="h-8 w-8 mb-4 text-success" />
            <h3 className="text-2xl font-bold">Active</h3>
            <p className="text-muted-foreground">System Status</p>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Accuracy Trend Chart */}
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-xl font-bold mb-4">Mapping Accuracy Trend</h3>
            <Chart
              type="line"
              data={{
                labels: stats.accuracyTrend.map(d => d.date),
                datasets: [{
                  label: 'Accuracy',
                  data: stats.accuracyTrend.map(d => d.accuracy * 100),
                  borderColor: 'hsl(var(--primary))',
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                  tension: 0.4,
                  fill: true
                }]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: { mode: 'index' }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: 'Confidence %' }
                  }
                }
              }}
            />
          </Card>

          {/* System Distribution */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">System Distribution</h3>
            <div className="space-y-4">
              {Object.entries(stats.systemBreakdown).map(([system, count]) => (
                <div key={system} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{system}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <Progress
                    value={(count / stats.totalMappings) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Mappings */}
          <Card className="lg:col-span-3 p-6">
            <h3 className="text-xl font-bold mb-4">Recent Mappings</h3>
            <div className="space-y-4">
              {stats.recentMappings.map((mapping, index) => (
                <div
                  key={mapping.id}
                  className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                >
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

              {stats.recentMappings.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No mappings yet. Start by creating your first mapping!
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
