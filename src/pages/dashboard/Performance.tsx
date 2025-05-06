
import React from "react";
import { useProjectSummaryQuery } from "@/hooks/useProjectsQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Home, ChartBar, CircleDollarSign, 
  TrendingUp, ChartPie, Clock, ArrowUp, ArrowDown, ArrowRight
} from "lucide-react";
import ProjectValueChart from "@/components/charts/ProjectValueChart";

// Helper functions
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

const formatDays = (days: number): string => {
  if (days >= 365) {
    return `${(days / 365).toFixed(1)} years`;
  } else {
    return `${Math.round(days)} days`;
  }
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

const Performance = () => {
  const { data: summary, isLoading, isError, error } = useProjectSummaryQuery();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[300px]">
      <p>Loading performance data...</p>
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
        <h2 className="text-2xl font-bold">Sales & Booking Performance</h2>
        <p className="text-muted-foreground">Sales metrics and project performance</p>
      </div>
      
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
    </div>
  );
};

export default Performance;
