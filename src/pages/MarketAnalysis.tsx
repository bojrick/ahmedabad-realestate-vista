
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOptimizedYearlyData } from "@/hooks/useOptimizedYearlyData";
import YearlyTimeSeriesChart from "@/components/charts/YearlyTimeSeriesChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lac`;
  } else {
    return `₹${amount.toLocaleString()}`;
  }
};

const MarketAnalysis = () => {
  const {
    projectsApproved,
    avgUnitConsideration,
    isLoading,
    filterOptions,
    setFilter
  } = useOptimizedYearlyData();

  const handleFilterChange = (filterType: string, value: string) => {
    setFilter(filterType as any, value);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-realestate-primary mb-2">
          Market Analysis
        </h1>
        <p className="text-muted-foreground">
          In-depth analysis of the Gujarat real estate market over time
        </p>
      </div>
      
      <Tabs defaultValue="time-series" className="w-full">
        <TabsList>
          <TabsTrigger value="time-series">Time Series Analysis</TabsTrigger>
          <TabsTrigger value="summary">Market Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="time-series" className="space-y-6">
          <h2 className="text-xl font-semibold mt-4">Yearly Market Trends</h2>
          <p className="text-muted-foreground mb-6">
            Analysis of project approvals and average unit considerations over time.
            Use the filters to analyze specific segments of the market.
          </p>
          
          {isLoading ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Loading Data</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <YearlyTimeSeriesChart
                title="Projects Approved by Year"
                data={projectsApproved}
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
              />
              
              <YearlyTimeSeriesChart
                title="Average Unit Consideration by Year"
                data={avgUnitConsideration}
                valueFormatter={formatCurrency}
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[400px]">
              {isLoading ? (
                <p>Loading market data...</p>
              ) : (
                <p className="text-center text-muted-foreground">
                  Market analysis dashboard with additional statistics coming soon
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketAnalysis;
