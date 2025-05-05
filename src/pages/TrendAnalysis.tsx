
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectData } from "@/hooks/useProjectData";

const TrendAnalysis = () => {
  const { summary, loading } = useProjectData();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-realestate-primary mb-2">
          Trend Analysis
        </h1>
        <p className="text-muted-foreground">
          Identify trends and patterns in Gujarat's real estate market
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          {loading ? (
            <p>Loading trend data...</p>
          ) : (
            <p className="text-center text-muted-foreground">
              Trend analysis dashboard coming soon
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendAnalysis;
