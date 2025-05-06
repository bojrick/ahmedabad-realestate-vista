
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem,
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { ProjectData, ProjectFilters } from "@/types/project";
import ProjectCard from "./ProjectCard";
import ProjectTable from "./ProjectTable";

interface ProjectListProps {
  projects: ProjectData[];
  loading: boolean;
  onFilterChange: (filters: ProjectFilters) => void;
  onResetFilters: () => void;
  viewType?: "list" | "table";
  totalCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  loading, 
  onFilterChange, 
  onResetFilters,
  viewType = "list",
  totalCount = 0,
  currentPage = 1,
  onPageChange,
  hasNextPage = false,
  hasPreviousPage = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique project types, statuses, and locations from available projects
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

  // Calculate pagination
  const pageSize = 12; // Number of items per page
  const totalPages = Math.ceil(totalCount / pageSize);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page, last page, current page, and pages around current page
      if (currentPage <= 3) {
        // Current page is near the beginning
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(-1); // Ellipsis
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Current page is near the end
        pageNumbers.push(1);
        pageNumbers.push(-1); // Ellipsis
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Current page is in the middle
        pageNumbers.push(1);
        pageNumbers.push(-1); // Ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(-1); // Ellipsis
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

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
          {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
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
      
      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange && onPageChange(currentPage - 1)}
                  className={!hasPreviousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {getPageNumbers().map((pageNumber, i) => (
                pageNumber === -1 ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={pageNumber === currentPage}
                      onClick={() => onPageChange && onPageChange(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange && onPageChange(currentPage + 1)}
                  className={!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
        {totalCount > 0 ? ` of ${totalCount} total` : ''}
      </div>
    </div>
  );
};

export default ProjectList;
