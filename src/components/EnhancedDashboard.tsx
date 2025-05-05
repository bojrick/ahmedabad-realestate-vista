
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProjectSummary } from "@/types/project";
import { Database, ChartBar, ChartPie, MapPin } from "lucide-react";
import ProjectTypeChart from "./charts/ProjectTypeChart";
import ProjectStatusChart from "./charts/ProjectStatusChart";
import ProjectLocationChart from "./charts/ProjectLocationChart";
import ProjectValueChart from "./charts/ProjectValueChart";

interface EnhancedDashboardProps {
  summary: ProjectSummary | null;
  loading: boolean;
}

// Helper function to format currency values in Crores and Lakhs
const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lac`;
  } else {
    return `₹${amount.toLocaleString()}`;
  }
};

// Helper function to format area
const formatArea = (area: number): string => {
  if (area >= 10000) {
    return `${(area / 10000).toFixed(2)} Hectares`;
  } else {
    return `${area.toLocaleString()} sq.m`;
  }
};

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ summary, loading }) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Real Estate Dashboard</h2>
        <p className="text-muted-foreground">Analytics overview for Gujarat RERA projects</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Registered real estate projects
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Combined project value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Booking</CardTitle>
            <ChartPie className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.avgBookingPercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Average booking percentage
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
            <ChartPie className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.avgProgress.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Average project completion
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Projects by Type</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ProjectTypeChart data={summary.projectsByType} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Projects by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ProjectStatusChart data={summary.projectsByStatus} />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Projects by Location</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ProjectLocationChart data={summary.projectsByLocation} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ProjectValueChart 
            totalValue={summary.financialSummary.totalValue} 
            receivedAmount={summary.financialSummary.receivedAmount} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDashboard;
