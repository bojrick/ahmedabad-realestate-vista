
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProjectSummary } from "@/types/project";
import { 
  Database, ChartBar, ChartPie, MapPin, 
  BarChart3, Clock, Users, CircleDollarSign, 
  TrendingUp, Home, Building, Layers, AlertTriangle, 
  HelpCircle, ArrowUp, ArrowDown, ArrowRight
} from "lucide-react";
import ProjectTypeChart from "./charts/ProjectTypeChart";
import ProjectStatusChart from "./charts/ProjectStatusChart";
import ProjectLocationChart from "./charts/ProjectLocationChart";
import ProjectValueChart from "./charts/ProjectValueChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Helper function to format percentage
const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Helper function to format days
const formatDays = (days: number): string => {
  if (days >= 365) {
    return `${(days / 365).toFixed(1)} years`;
  } else {
    return `${Math.round(days)} days`;
  }
};

// Helper to render YoY change indicator
const YoYChangeIndicator = ({ value, reverse = false }: { value: number | undefined, reverse?: boolean }) => {
  if (value === undefined) return null;
  
  // Determine if the change is positive (good) or negative (bad)
  // For some metrics like cost variance, a decrease is good (reverse=true)
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

      <Tabs defaultValue="market" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-6">
          <TabsTrigger value="market">Market Overview</TabsTrigger>
          <TabsTrigger value="projects">Project Pipeline</TabsTrigger>
          <TabsTrigger value="financial">Financial Health</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        {/* Market Overview Tab */}
        <TabsContent value="market" className="space-y-6">
          <h3 className="text-lg font-semibold">Market Overview</h3>
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
        </TabsContent>
        
        {/* Project Pipeline Tab */}
        <TabsContent value="projects" className="space-y-6">
          <h3 className="text-lg font-semibold">Project Pipeline</h3>
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
            
            {summary.projectsByPromoterType && (
              <Card>
                <CardHeader>
                  <CardTitle>Projects by Promoter Type</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ProjectTypeChart data={summary.projectsByPromoterType} />
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Promoters</CardTitle>
              </CardHeader>
              <CardContent className="h-80 overflow-y-auto">
                <div className="space-y-4">
                  {summary.topPromoters && Object.entries(summary.topPromoters)
                    .sort((a, b) => b[1] - a[1])
                    .map(([promoter, count], index) => (
                      <div key={promoter} className="flex items-center">
                        <div className="w-8 text-muted-foreground">{index + 1}.</div>
                        <div className="flex-1 font-medium truncate" title={promoter}>
                          {promoter}
                        </div>
                        <div className="ml-4 text-right font-mono">
                          {count} projects
                        </div>
                      </div>
                    ))
                  }
                </div>
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
        </TabsContent>
        
        {/* Financial Health Tab */}
        <TabsContent value="financial" className="space-y-6">
          <h3 className="text-lg font-semibold">Financial Health</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Land Cost</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">
                    {formatCurrency(summary.financials?.landCost || 0)}
                  </div>
                  {summary.financials?.yoyLandCost !== undefined && (
                    <YoYChangeIndicator value={summary.financials.yoyLandCost} />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total land acquisition cost
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Development Cost</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">
                    {formatCurrency(summary.financials?.developmentCost || 0)}
                  </div>
                  {summary.financials?.yoyDevelopmentCost !== undefined && (
                    <YoYChangeIndicator value={summary.financials.yoyDevelopmentCost} />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total development expenses
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxes & Premiums</CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summary.financials?.taxesAndPremiums || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total tax and premium payments
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interest Charges</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summary.financials?.interestCharges || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total interest paid to financing
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summary.financials?.netCashFlow || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Net cash flow from projects
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Variance</CardTitle>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">
                    {formatPercentage(summary.financials?.avgCostVariance || 0)}
                  </div>
                  {summary.financials?.yoyCostVariance !== undefined && (
                    <YoYChangeIndicator value={summary.financials.yoyCostVariance} reverse={true} />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average cost variance from estimates
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Land vs Development Cost Split</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <div className="flex h-full w-full items-center justify-center">
                <ProjectValueChart 
                  totalValue={summary.financials?.landCost || 0} 
                  receivedAmount={summary.financials?.developmentCost || 0}
                  labelA="Land Cost"
                  labelB="Development Cost"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <h3 className="text-lg font-semibold">Sales & Booking Performance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary.salesPerformance?.totalUnits.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total available units
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Booked Units</CardTitle>
                <ChartBar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">
                    {summary.salesPerformance?.bookedUnits.toLocaleString() || '0'}
                  </div>
                  {summary.salesPerformance?.yoyBookedUnits !== undefined && (
                    <YoYChangeIndicator value={summary.salesPerformance.yoyBookedUnits} />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total units booked
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue Received</CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">
                    {formatCurrency(summary.salesPerformance?.receivedAmount || 0)}
                  </div>
                  {summary.salesPerformance?.yoyReceivedAmount !== undefined && (
                    <YoYChangeIndicator value={summary.salesPerformance.yoyReceivedAmount} />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total revenue collected
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue per Unit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summary.salesPerformance?.revenuePerUnit || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average revenue per booked unit
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
                    {formatPercentage(summary.salesPerformance?.avgCollectionPercentage || 0)}
                  </div>
                  {summary.salesPerformance?.yoyCollectionPercentage !== undefined && (
                    <YoYChangeIndicator value={summary.salesPerformance.yoyCollectionPercentage} />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Payment collection percentage
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Project Duration</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">
                    {formatDays(summary.projectVelocity?.avgProjectDuration || 0)}
                  </div>
                  {summary.projectVelocity?.yoyAvgProjectDuration !== undefined && (
                    <YoYChangeIndicator value={summary.projectVelocity.yoyAvgProjectDuration} reverse={true} />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average project duration
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Units Booked vs Total</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex h-full w-full items-center justify-center">
                  <ProjectValueChart 
                    totalValue={(summary.salesPerformance?.totalUnits || 0)} 
                    receivedAmount={(summary.salesPerformance?.bookedUnits || 0)}
                    labelA="Total Units"
                    labelB="Booked Units"
                    isNumeric={true}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Project Completion Status</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex flex-col h-full w-full items-center justify-center space-y-8">
                  <div className="w-full">
                    <p className="text-sm text-muted-foreground mb-2">On-time vs Delayed Completions</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-100 p-4 rounded-lg text-center">
                        <h3 className="text-xl font-bold text-green-600">
                          {summary.projectVelocity?.completedOnTime || 0}
                        </h3>
                        <p className="text-sm text-green-800">On Time</p>
                      </div>
                      <div className="bg-red-100 p-4 rounded-lg text-center">
                        <h3 className="text-xl font-bold text-red-600">
                          {summary.projectVelocity?.completedDelayed || 0}
                        </h3>
                        <p className="text-sm text-red-800">Delayed</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <p className="text-sm text-muted-foreground mb-2">Architect & Engineer Scores</p>
                    <div className="space-y-4">
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <p className="text-sm">Architect Score</p>
                          <div className="flex items-center">
                            <span className="font-medium">{(summary.avgArchScore || 0).toFixed(1)}/10</span>
                            {summary.yoyAvgArchScore !== undefined && (
                              <YoYChangeIndicator value={summary.yoyAvgArchScore} />
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-blue-600 h-4 rounded-full"
                            style={{ width: `${Math.min(100, (summary.avgArchScore || 0) * 10)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <p className="text-sm">Engineer Score</p>
                          <div className="flex items-center">
                            <span className="font-medium">{(summary.avgEngScore || 0).toFixed(1)}/10</span>
                            {summary.yoyAvgEngScore !== undefined && (
                              <YoYChangeIndicator value={summary.yoyAvgEngScore} />
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-green-600 h-4 rounded-full"
                            style={{ width: `${Math.min(100, (summary.avgEngScore || 0) * 10)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedDashboard;
