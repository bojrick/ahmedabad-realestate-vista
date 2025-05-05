
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectSummaryQuery, useProjectsQuery } from "@/hooks/useProjectsQuery";
import Navbar from "@/components/Navbar";
import EnhancedDashboard from "@/components/EnhancedDashboard";
import ProjectList from "@/components/ProjectList";

const Index = () => {
  const {
    data: summary,
    isLoading,
    isError,
    error
  } = useProjectSummaryQuery();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Get the first 12 projects for the projects tab
  const { 
    projects, 
    isLoading: projectsLoading 
  } = useProjectsQuery();
  
  if (isError) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
          <p className="text-lg text-gray-600 mb-4">{(error as Error)?.message || "An unknown error occurred"}</p>
          <p>Please check your Supabase connection and try again.</p>
        </div>
      </div>;
  }
  
  return <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-realestate-primary">
            Gujarat RERA Project Analytics
          </h1>
          <p className="text-muted-foreground">
            Real estate analytics and insights dashboard for Gujarat RERA registered projects
          </p>
        </div>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="pt-6">
            <EnhancedDashboard summary={summary} loading={isLoading} />
          </TabsContent>
          
          <TabsContent value="projects" className="pt-6">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Showing recent projects. Visit the <a href="/projects" className="text-blue-600 hover:underline">Projects Explorer</a> for more filtering and pagination options.
              </p>
            </div>
            
            <ProjectList 
              projects={projects}
              loading={projectsLoading}
              onFilterChange={() => {}} // No-op since this is a simplified view
              onResetFilters={() => {}} // No-op since this is a simplified view
            />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t bg-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Gujarat RERA Project Analytics. All rights reserved.</p>
        </div>
      </footer>
    </div>;
};
export default Index;
