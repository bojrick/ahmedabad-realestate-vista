
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectData } from "@/hooks/useProjectData";

const MarketAnalysis = () => {
  const { summary, loading } = useProjectData();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-realestate-primary mb-2">
          Market Analysis
        </h1>
        <p className="text-muted-foreground">
          In-depth analysis of the Gujarat real estate market
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          {loading ? (
            <p>Loading market data...</p>
          ) : (
            <p className="text-center text-muted-foreground">
              Market analysis dashboard coming soon
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketAnalysis;
