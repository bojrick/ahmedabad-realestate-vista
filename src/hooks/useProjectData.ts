
import { useState, useEffect } from "react";
import { ProjectData, ProjectSummary, ProjectFilters } from "@/types/project";
import { fetchProjects, calculateProjectsSummary } from "@/adapters/projectsAdapter";
import { useToast } from "@/hooks/use-toast";

export const useProjectData = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>([]);
  const [summary, setSummary] = useState<ProjectSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      
      try {
        const data = await fetchProjects();
        setProjects(data);
        setFilteredProjects(data);
        const projectSummary = calculateProjectsSummary(data);
        setSummary(projectSummary);
      } catch (err) {
        console.error("Error loading projects:", err);
        setError("Failed to load real estate projects");
        toast({
          title: "Error",
          description: "Failed to load real estate projects",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, []);
  
  const filterProjects = (filters: ProjectFilters): void => {
    let filtered = [...projects];
    
    // Apply filters
    if (filters.type && filters.type.length) {
      filtered = filtered.filter(p => filters.type!.includes(p.type));
    }
    
    if (filters.status && filters.status.length) {
      filtered = filtered.filter(p => filters.status!.includes(p.status));
    }
    
    if (filters.location && filters.location.length) {
      filtered = filtered.filter(p => filters.location!.includes(p.location));
    }
    
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.financials.totalValue >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.financials.totalValue <= filters.maxPrice!);
    }
    
    if (filters.minArea !== undefined) {
      filtered = filtered.filter(p => p.area.total >= filters.minArea!);
    }
    
    if (filters.maxArea !== undefined) {
      filtered = filtered.filter(p => p.area.total <= filters.maxArea!);
    }

    if (filters.minProgress !== undefined) {
      filtered = filtered.filter(p => p.progress >= filters.minProgress!);
    }
    
    if (filters.maxProgress !== undefined) {
      filtered = filtered.filter(p => p.progress <= filters.maxProgress!);
    }
    
    setFilteredProjects(filtered);
    const newSummary = calculateProjectsSummary(filtered);
    setSummary(newSummary);
  };
  
  const resetFilters = (): void => {
    setFilteredProjects(projects);
    const newSummary = calculateProjectsSummary(projects);
    setSummary(newSummary);
  };
  
  return {
    projects: filteredProjects,
    allProjects: projects,
    summary,
    loading,
    error,
    filterProjects,
    resetFilters
  };
};
