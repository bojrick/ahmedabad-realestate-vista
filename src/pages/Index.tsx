import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectData } from "@/hooks/useProjectData";
import Navbar from "@/components/Navbar";
import EnhancedDashboard from "@/components/EnhancedDashboard";
import ProjectList from "@/components/ProjectList";
const Index = () => {
  const {
    projects,
    summary,
    loading,
    error,
    filterProjects,
    resetFilters
  } = useProjectData();
  const [activeTab, setActiveTab] = useState("dashboard");
  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
          <p className="text-lg text-gray-600 mb-4">{error}</p>
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
            
          </TabsList>
          
          <TabsContent value="dashboard" className="pt-6">
            <EnhancedDashboard summary={summary} loading={loading} />
          </TabsContent>
          
          <TabsContent value="projects" className="pt-6">
            <ProjectList projects={projects} loading={loading} onFilterChange={filterProjects} onResetFilters={resetFilters} />
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