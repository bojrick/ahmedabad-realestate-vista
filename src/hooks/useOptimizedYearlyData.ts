
import { useState } from "react";
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

export function useOptimizedYearlyData() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    type: 'all',
    location: 'all'
  });

  const setFilter = (type: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  // Query for yearly project data from the view
  const { data: yearlyData, isLoading: isYearlyLoading } = useQuery({
    queryKey: ['optimizedYearlyData', filters],
    queryFn: async () => {
      try {
        // Use the yearly_projects_summary view
        let query = supabase.from('yearly_projects_summary').select('*');
        
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

        const { data, error } = await query;
        
        if (error) throw error;
        
        console.log(`Fetched ${data.length} yearly summary records`);
        
        // Process into the format needed by charts
        const yearMap = new Map<number, { approved: number, consideration: number }>();
        
        data.forEach(item => {
          if (!yearMap.has(item.year)) {
            yearMap.set(item.year, { approved: 0, consideration: 0 });
          }
          
          const yearData = yearMap.get(item.year)!;
          yearData.approved += item.projects_approved;
          yearData.consideration = 
            (yearData.consideration * yearData.approved + item.avg_unit_consideration * item.projects_approved) / 
            (yearData.approved + item.projects_approved);
        });
        
        const projectsApproved: YearlyDataPoint[] = [];
        const avgUnitConsideration: YearlyDataPoint[] = [];
        
        yearMap.forEach((data, year) => {
          projectsApproved.push({ year, value: data.approved });
          avgUnitConsideration.push({ year, value: data.consideration });
        });
        
        // Sort by year
        projectsApproved.sort((a, b) => a.year - b.year);
        avgUnitConsideration.sort((a, b) => a.year - b.year);
        
        return { projectsApproved, avgUnitConsideration };
      } catch (error) {
        console.error("Error fetching optimized yearly data:", error);
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
  
  // Query for filter options - can be cached longer since they rarely change
  const { data: filterOptionsData } = useQuery({
    queryKey: ['yearlyFilterOptions'],
    queryFn: async () => {
      try {
        // Get unique values for status, type and location from the respective views
        const [{ data: statusData }, { data: typeData }, { data: locationData }] = await Promise.all([
          supabase.from('gujrera_projects_detailed_summary').select('projectstatus').distinct(),
          supabase.from('project_types_summary').select('projecttype'),
          supabase.from('project_locations_summary').select('location').limit(50)
        ]);
        
        return {
          status: (statusData || []).map(item => ({
            value: item.projectstatus || '',
            label: item.projectstatus || 'Unknown'
          })),
          type: (typeData || []).map(item => ({
            value: item.projecttype || '',
            label: item.projecttype || 'Unknown'
          })),
          location: (locationData || []).map(item => ({
            value: item.location || '',
            label: item.location || 'Unknown'
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
