
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface YearlyDataPoint {
  year: number;
  value: number;
}

interface FilterState {
  status: string;
  type: string;
  location: string;
}

interface YearlyProjectDataResult {
  projectsApproved: YearlyDataPoint[];
  avgUnitConsideration: YearlyDataPoint[];
  isLoading: boolean;
  filterOptions: {
    status: Array<{ value: string, label: string }>;
    type: Array<{ value: string, label: string }>;
    location: Array<{ value: string, label: string }>;
  };
  filters: FilterState;
  setFilter: (type: keyof FilterState, value: string) => void;
}

export function useYearlyProjectData(): YearlyProjectDataResult {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    type: 'all',
    location: 'all'
  });

  const setFilter = (type: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  // Query for yearly project data
  const { data: yearlyData, isLoading: isYearlyLoading } = useQuery({
    queryKey: ['yearlyProjectData', filters],
    queryFn: async () => {
      try {
        // Fetch all projects with relevant fields for yearly analysis
        // We'll need to process this data to extract yearly patterns
        let query = supabase
          .from('gujrera_projects_detailed_summary')
          .select(`
            projectregid,
            projectapprovedate,
            projectstatus,
            projecttype,
            distname,
            total_unit_consideration
          `);

        // Apply filters
        if (filters.status !== 'all') {
          query = query.eq('projectstatus', filters.status);
        }
        
        if (filters.type !== 'all') {
          query = query.eq('projecttype', filters.type);
        }
        
        if (filters.location !== 'all') {
          query = query.eq('distname', filters.location);
        }

        // We'll need to fetch all records using pagination to bypass the 1000 record limit
        const allProjects = await fetchAllPaginatedData(query);
        
        console.log(`Fetched ${allProjects.length} projects for yearly analysis`);
        
        // Process the data to get yearly statistics
        return processYearlyData(allProjects);
      } catch (error) {
        console.error("Error fetching yearly project data:", error);
        toast({
          title: "Error",
          description: "Failed to load yearly project data",
          variant: "destructive"
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });
  
  // Query for filter options
  const { data: filterOptionsData } = useQuery({
    queryKey: ['yearlyFilterOptions'],
    queryFn: async () => {
      try {
        // Fetch unique values for status, type and location
        const [statusData, typeData, locationData] = await Promise.all([
          fetchUniqueValues('projectstatus'),
          fetchUniqueValues('projecttype'),
          fetchUniqueValues('distname')
        ]);
        
        return {
          status: statusData.map(status => ({
            value: status || '',
            label: status || 'Unknown'
          })),
          type: typeData.map(type => ({
            value: type || '',
            label: type || 'Unknown'
          })),
          location: locationData.map(location => ({
            value: location || '',
            label: location || 'Unknown'
          }))
        };
      } catch (error) {
        console.error("Error fetching filter options:", error);
        return {
          status: [],
          type: [],
          location: []
        };
      }
    },
    staleTime: 10 * 60 * 1000 // Cache for 10 minutes
  });

  return {
    projectsApproved: yearlyData?.projectsApproved || [],
    avgUnitConsideration: yearlyData?.avgUnitConsideration || [],
    isLoading: isYearlyLoading,
    filterOptions: filterOptionsData || {
      status: [],
      type: [],
      location: []
    },
    filters,
    setFilter
  };
}

// Helper function to fetch unique values for a column
async function fetchUniqueValues(column: string): Promise<string[]> {
  let allValues: string[] = [];
  let hasMore = true;
  let page = 0;
  const pageSize = 1000;
  const seen = new Set<string>();
  
  while (hasMore) {
    const { data: chunk, error } = await supabase
      .from('gujrera_projects_detailed_summary')
      .select(column)
      .range(page * pageSize, (page + 1) * pageSize - 1);
    
    if (error) throw error;
    
    if (chunk.length === 0) {
      hasMore = false;
    } else {
      // Extract unique values
      chunk.forEach((item: any) => {
        const value = item[column];
        if (value && !seen.has(value)) {
          seen.add(value);
          allValues.push(value);
        }
      });
      
      page++;
      
      // Safety check to prevent infinite loops
      if (page > 50) hasMore = false;
    }
  }
  
  return allValues.sort();
}

// Helper function to fetch all paginated data from any query
async function fetchAllPaginatedData<T>(query: any): Promise<T[]> {
  let allData: T[] = [];
  let hasMore = true;
  let page = 0;
  const pageSize = 1000;

  while (hasMore) {
    const { data: chunk, error } = await query
      .range(page * pageSize, (page + 1) * pageSize - 1);
      
    if (error) throw error;
    
    allData = [...allData, ...chunk];
    
    if (chunk.length < pageSize) {
      hasMore = false;
    } else {
      page++;
    }
  }
  
  return allData;
}

// Process the raw project data into yearly statistics
function processYearlyData(projects: any[]) {
  // Get the range of years from the data
  const years = new Set<number>();
  const projectsByYear: Record<number, any[]> = {};
  
  // Process projects by year
  projects.forEach(project => {
    let year: number | null = null;
    
    // Try to extract year from project approval date
    if (project.projectapprovedate) {
      const match = project.projectapprovedate.match(/(\d{4})/);
      if (match) {
        year = parseInt(match[1], 10);
      }
    }
    
    // If we couldn't extract a year, skip this project
    if (!year || year < 2010 || year > new Date().getFullYear()) {
      return;
    }
    
    years.add(year);
    
    if (!projectsByYear[year]) {
      projectsByYear[year] = [];
    }
    
    projectsByYear[year].push(project);
  });
  
  // Convert to sorted array of years
  const sortedYears = Array.from(years).sort();
  
  // Calculate projects approved per year
  const projectsApproved = sortedYears.map(year => ({
    year,
    value: projectsByYear[year].length
  }));
  
  // Calculate average unit consideration per year
  const avgUnitConsideration = sortedYears.map(year => {
    const yearProjects = projectsByYear[year];
    const validProjects = yearProjects.filter(p => p.total_unit_consideration && p.total_unit_consideration > 0);
    
    let avgValue = 0;
    if (validProjects.length > 0) {
      const total = validProjects.reduce((sum, p) => sum + p.total_unit_consideration, 0);
      avgValue = total / validProjects.length;
    }
    
    return {
      year,
      value: avgValue
    };
  });
  
  return { projectsApproved, avgUnitConsideration };
}
