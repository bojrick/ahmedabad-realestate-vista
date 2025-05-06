
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProjectSummary } from "@/types/project";
import { 
  ChartPie, BarChart3, CircleDollarSign, 
  TrendingUp
} from "lucide-react";

interface EnhancedDashboardProps {
  summary: ProjectSummary | null;
  loading: boolean;
}

// Component that serves as a navigation dashboard to the detailed views
const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ summary, loading }) => {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p>No data available</p>
      </div>
    );
  }

  const dashboardSections = [
    {
      title: "Market Overview",
      description: "Market snapshot and high-level project statistics",
      path: "/dashboard/market-overview",
      icon: ChartPie,
      color: "bg-blue-500"
    },
    {
      title: "Project Pipeline",
      description: "Project distribution by type, status, and promoters",
      path: "/dashboard/project-pipeline",
      icon: BarChart3,
      color: "bg-green-500"
    },
    {
      title: "Financial Health",
      description: "Cost analysis and financial performance metrics",
      path: "/dashboard/financial-health",
      icon: CircleDollarSign,
      color: "bg-amber-500"
    },
    {
      title: "Performance",
      description: "Sales and booking performance metrics",
      path: "/dashboard/performance", 
      icon: TrendingUp,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Real Estate Dashboard</h2>
        <p className="text-muted-foreground">Select a dashboard section to view detailed analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardSections.map((section) => (
          <Card 
            key={section.title}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(section.path)}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className={`p-3 rounded-md ${section.color} text-white`}>
                <section.icon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end">
                <button 
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(section.path);
                  }}
                >
                  View Details →
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 bg-slate-50 p-6 rounded-lg border border-slate-200">
        <h3 className="text-lg font-medium mb-2">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Projects</p>
            <p className="text-2xl font-bold">{summary.totalProjects.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Projects</p>
            <p className="text-2xl font-bold">{summary.activeProjects?.toLocaleString() || '0'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">
              {summary.totalValue >= 10000000 
                ? `₹${(summary.totalValue / 10000000).toFixed(2)} Cr`
                : `₹${(summary.totalValue / 100000).toFixed(2)} Lac`}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg. Progress</p>
            <p className="text-2xl font-bold">{summary.avgProgress.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
