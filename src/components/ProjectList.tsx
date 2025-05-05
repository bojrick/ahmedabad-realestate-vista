
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Search, Filter } from "lucide-react";
import { ProjectData, ProjectFilters } from "@/types/project";
import ProjectCard from "./ProjectCard";
import ProjectTable from "./ProjectTable";

interface ProjectListProps {
  projects: ProjectData[];
  loading: boolean;
  onFilterChange: (filters: ProjectFilters) => void;
  onResetFilters: () => void;
  viewType?: "list" | "table";
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  loading, 
  onFilterChange, 
  onResetFilters,
  viewType = "list"
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique project types, statuses, and locations
  const projectTypes = [...new Set(projects.map(project => project.type))].filter(Boolean);
  const projectStatuses = [...new Set(projects.map(project => project.status))].filter(Boolean);
  const projectLocations = [...new Set(projects.map(project => project.location))].filter(Boolean);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (key: keyof ProjectFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const applyFilters = () => {
    onFilterChange({ 
      ...filters,
      // Add search term filter logic here if needed
    });
  };
  
  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
    onResetFilters();
  };
  
  // Filter projects by search term locally (name, location, promoter)
  const filteredProjects = searchTerm 
    ? projects.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.promoter.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : projects;

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects by name, location, or promoter..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          Filters
        </Button>
        
        <Button onClick={applyFilters}>
          Apply
        </Button>
        
        <Button variant="outline" onClick={clearFilters}>
          Reset
        </Button>
      </div>
      
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Type</label>
                <Select 
                  value={filters.type?.[0] || ""}
                  onValueChange={(value) => handleFilterChange('type', value ? [value] : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Status</label>
                <Select 
                  value={filters.status?.[0] || ""}
                  onValueChange={(value) => handleFilterChange('status', value ? [value] : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectStatuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select 
                  value={filters.location?.[0] || ""}
                  onValueChange={(value) => handleFilterChange('location', value ? [value] : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectLocations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Progress</label>
                <Slider 
                  defaultValue={[0, 100]} 
                  min={0} 
                  max={100} 
                  step={1}
                  onValueChange={(value) => {
                    handleFilterChange('minProgress', value[0]);
                    handleFilterChange('maxProgress', value[1]);
                  }} 
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{filters.minProgress || 0}%</span>
                  <span>{filters.maxProgress || 100}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <p>Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          {viewType === "list" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <ProjectTable projects={filteredProjects} />
          )}
        </>
      )}
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Showing {filteredProjects.length} of {projects.length} projects
      </div>
    </div>
  );
};

export default ProjectList;
