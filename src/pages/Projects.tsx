
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useProjectsQuery } from "@/hooks/useProjectsQuery";
import ProjectList from "@/components/ProjectList";
import { ProjectFilters } from "@/types/project";
import { Filter, MapPin, Loader } from "lucide-react";

const Projects = () => {
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
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-realestate-primary mb-2">
          Projects Explorer
        </h1>
        <p className="text-muted-foreground">
          Browse and filter through all registered RERA projects
        </p>
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
