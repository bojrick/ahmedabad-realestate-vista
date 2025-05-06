
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useProjectsQuery } from "@/hooks/useProjectsQuery";
import ProjectList from "@/components/ProjectList";
import { ProjectFilters } from "@/types/project";
import { MapPin, Filter, Table, List, Loader } from "lucide-react";

const Projects = () => {
  const [viewType, setViewType] = useState<"list" | "table">("list");
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  
  const {
    projects,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    totalCount
  } = useProjectsQuery(filters);
  
  const handleFilterChange = (newFilters: ProjectFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const resetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page > (projects.length / 12)) {
      fetchNextPage();
    }
  };

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
          <p className="text-lg text-gray-600 mb-4">{(error as Error)?.message || "An unknown error occurred"}</p>
          <p>Please check your Supabase connection and try again.</p>
        </div>
      </div>
    );
  }

  // Calculate paginated projects
  const pageSize = 12;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProjects = projects.slice(startIndex, endIndex);

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
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2">Loading projects...</span>
        </div>
      ) : (
        <ProjectList 
          projects={paginatedProjects}
          loading={isLoading}
          onFilterChange={handleFilterChange}
          onResetFilters={resetFilters}
          viewType={viewType}
          totalCount={totalCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          hasNextPage={hasNextPage}
          hasPreviousPage={currentPage > 1}
        />
      )}
    </div>
  );
};

export default Projects;
