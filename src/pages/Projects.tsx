
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectData } from "@/hooks/useProjectData";
import ProjectList from "@/components/ProjectList";
import { MapPin, Filter, Table, List } from "lucide-react";

const Projects = () => {
  const { projects, loading, error, filterProjects, resetFilters } = useProjectData();
  const [viewType, setViewType] = useState<"list" | "table">("list");

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
          <p className="text-lg text-gray-600 mb-4">{error}</p>
          <p>Please check your Supabase connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-realestate-primary mb-2">
          Projects Explorer
        </h1>
        <p className="text-muted-foreground">
          Browse and filter through all registered RERA projects
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant={viewType === "list" ? "default" : "outline"} 
            size="sm"
            onClick={() => setViewType("list")}
          >
            <List className="mr-1 h-4 w-4" />
            Cards
          </Button>
          <Button 
            variant={viewType === "table" ? "default" : "outline"}
            size="sm" 
            onClick={() => setViewType("table")}
          >
            <Table className="mr-1 h-4 w-4" />
            Table
          </Button>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm">
            <Filter className="mr-1 h-4 w-4" />
            Advanced Filters
          </Button>
          <Button variant="outline" size="sm">
            <MapPin className="mr-1 h-4 w-4" />
            Map View
          </Button>
        </div>
      </div>
      
      <ProjectList 
        projects={projects} 
        loading={loading} 
        onFilterChange={filterProjects}
        onResetFilters={resetFilters}
        viewType={viewType}
      />
    </div>
  );
};

export default Projects;
