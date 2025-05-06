
import React from "react";
import { useProjectSummaryQuery } from "@/hooks/useProjectsQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectSummary } from "@/types/project";
import { 
  Building, Home, AlertTriangle, HelpCircle,
  CircleDollarSign, ChartBar, ChartPie, TrendingUp, Database,
  ArrowUp, ArrowDown, ArrowRight
} from "lucide-react";
import ProjectTypeChart from "@/components/charts/ProjectTypeChart";
import ProjectStatusChart from "@/components/charts/ProjectStatusChart";

// Helper functions from EnhancedDashboard
const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lac`;
  } else {
    return `₹${amount.toLocaleString()}`;
  }
};

const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// YoY Change Indicator Component
const YoYChangeIndicator = ({ value, reverse = false }: { value: number | undefined, reverse?: boolean }) => {
  if (value === undefined) return null;
  
  const isPositive = reverse ? value < 0 : value > 0;
  const isNeutral = value === 0;
  
  return (
    <div className={`flex items-center ml-2 text-xs ${
      isNeutral ? 'text-gray-500' : 
      isPositive ? 'text-green-500' : 'text-red-500'
    }`}>
      {isNeutral ? (
        <ArrowRight className="h-3 w-3 mr-1" />
      ) : isPositive ? (
        <ArrowUp className="h-3 w-3 mr-1" />
      ) : (
        <ArrowDown className="h-3 w-3 mr-1" />
      )}
      <span>{Math.abs(value).toFixed(1)}%</span>
    </div>
  );
};

const MarketOverview = () => {
  const { data: summary, isLoading, isError, error } = useProjectSummaryQuery();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[300px]">
      <p>Loading market overview data...</p>
    </div>;
  }

  if (isError || !summary) {
    return <div className="flex justify-center items-center min-h-[300px]">
      <p>Error loading data: {(error as Error)?.message || "Unknown error"}</p>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Market Overview</h2>
        <p className="text-muted-foreground">Key metrics overview for Gujarat RERA projects</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{summary.activeProjects?.toLocaleString() || '0'}</div>
              {summary.yoyChanges?.activeProjects !== undefined && (
                <YoYChangeIndicator value={summary.yoyChanges.activeProjects} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Projects on track
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{summary.completedProjects?.toLocaleString() || '0'}</div>
              {summary.yoyChanges?.completedProjects !== undefined && (
                <YoYChangeIndicator value={summary.yoyChanges.completedProjects} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Fully completed projects
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed Projects</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.delayedProjects?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Projects behind schedule
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unreported Projects</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.unreportedProjects?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Status not reported
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{formatCurrency(summary.totalValue || 0)}</div>
              {summary.yoyChanges?.totalValue !== undefined && (
                <YoYChangeIndicator value={summary.yoyChanges.totalValue} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated market value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actual Spend</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalSpend || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Total cost incurred to date
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Booking</CardTitle>
            <ChartPie className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{formatPercentage(summary.avgBookingPercentage || 0)}</div>
              {summary.yoyChanges?.avgBookingPercentage !== undefined && (
                <YoYChangeIndicator value={summary.yoyChanges.avgBookingPercentage} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Average booking percentage
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection %</CardTitle>
            <ChartPie className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                {formatPercentage(summary.avgCollectionPercentage || 0)}
              </div>
              {summary.salesPerformance?.yoyCollectionPercentage !== undefined && (
                <YoYChangeIndicator value={summary.salesPerformance.yoyCollectionPercentage} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Average payment collection
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{formatPercentage(summary.avgProgress || 0)}</div>
              {summary.yoyChanges?.avgProgress !== undefined && (
                <YoYChangeIndicator value={summary.yoyChanges.avgProgress} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Average project completion
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{summary.totalProjects.toLocaleString()}</div>
              {summary.yoyChanges?.totalProjects !== undefined && (
                <YoYChangeIndicator value={summary.yoyChanges.totalProjects} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Registered real estate projects
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Market Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Projects by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ProjectStatusChart data={summary.projectsByStatus} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Projects by Type</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ProjectTypeChart data={summary.projectsByType} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketOverview;
