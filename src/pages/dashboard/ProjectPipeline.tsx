
import React from "react";
import { useProjectSummaryQuery } from "@/hooks/useProjectsQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectTypeChart from "@/components/charts/ProjectTypeChart";
import ProjectStatusChart from "@/components/charts/ProjectStatusChart";
import ProjectLocationChart from "@/components/charts/ProjectLocationChart";

const ProjectPipeline = () => {
  const { data: summary, isLoading, isError, error } = useProjectSummaryQuery();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[300px]">
      <p>Loading project pipeline data...</p>
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
        <h2 className="text-2xl font-bold">Project Pipeline</h2>
        <p className="text-muted-foreground">Project pipeline statistics and distribution</p>
      </div>
      
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
        
        {summary.projectsByPromoterType && Object.keys(summary.projectsByPromoterType).length > 0 && (
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
    </div>
  );
};

export default ProjectPipeline;
