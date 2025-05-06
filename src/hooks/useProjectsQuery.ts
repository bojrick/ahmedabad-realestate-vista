
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectData, ProjectFilters } from "@/types/project";
import { useToast } from "@/hooks/use-toast";
import { transformProjectData } from "@/adapters/projectsAdapter";

// Number of items to load per page
const PAGE_SIZE = 12;

// The known total count of projects
const TOTAL_PROJECTS_COUNT = 15000;

/**
 * Custom hook to fetch paginated projects with filters
 */
export const useProjectsQuery = (filters: ProjectFilters = {}) => {
  const { toast } = useToast();

  // Convert filters to query parameters
  const prepareQuery = (query: any) => {
    let baseQuery = query.from('gujrera_projects_detailed_summary').select('*');
    
    // Apply filters if provided
    if (filters.type && filters.type.length) {
      baseQuery = baseQuery.in('projecttype', filters.type);
    }
    
    if (filters.status && filters.status.length) {
      baseQuery = baseQuery.in('projectstatus', filters.status);
    }
    
    if (filters.location && filters.location.length) {
      baseQuery = baseQuery.in('distname', filters.location);
    }
    
    if (filters.minProgress !== undefined) {
      baseQuery = baseQuery.gte('projectprogress', filters.minProgress);
    }
    
    if (filters.maxProgress !== undefined) {
      baseQuery = baseQuery.lte('projectprogress', filters.maxProgress);
    }
    
    // Add other filters as needed
    
    return baseQuery;
  };
  
  // Use infinite query for pagination
  const projectsQuery = useInfiniteQuery({
    queryKey: ['projects', filters],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        // Prepare base query with filters
        const query = prepareQuery(supabase);
        
        // Add pagination
        const { data, error } = await query
          .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1)
          .order('projectregid', { ascending: false });
        
        if (error) throw error;
        
        // Transform the data to our application model
        const transformedData = data.map(transformProjectData);
        
        return {
          projects: transformedData,
          nextPage: data.length === PAGE_SIZE ? pageParam + 1 : undefined,
          totalCount: TOTAL_PROJECTS_COUNT // Use the known total count
        };
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error",
          description: "Failed to load projects data",
          variant: "destructive"
        });
        throw error;
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0
  });
  
  return {
    projects: projectsQuery.data?.pages.flatMap(page => page.projects) || [],
    isLoading: projectsQuery.isLoading,
    isFetching: projectsQuery.isFetching,
    isError: projectsQuery.isError,
    error: projectsQuery.error,
    hasNextPage: projectsQuery.hasNextPage,
    fetchNextPage: projectsQuery.fetchNextPage,
    isFetchingNextPage: projectsQuery.isFetchingNextPage,
    totalCount: TOTAL_PROJECTS_COUNT
  };
};

/**
 * Custom hook to fetch project summary statistics directly from database
 */
export const useProjectSummaryQuery = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['projectSummary'],
    queryFn: async () => {
      try {
        // Get total project count using RPC function
        const { data: countData, error: countError } = await supabase
          .rpc('get_total_projects_count');
        
        if (countError) throw countError;
        const totalProjects = countData || TOTAL_PROJECTS_COUNT;

        // Get total project value using RPC function
        const { data: totalValueData, error: valueError } = await supabase
          .rpc('get_total_project_value');
        
        if (valueError) throw valueError;
        const totalValue = totalValueData || 0;

        // Get average booking percentage using RPC function
        const { data: avgBookingData, error: bookingError } = await supabase
          .rpc('get_avg_booking_percentage');
        
        if (bookingError) throw bookingError;
        const avgBookingPercentage = avgBookingData || 0;

        // Get average project progress using RPC function
        const { data: avgProgressData, error: progressError } = await supabase
          .rpc('get_avg_project_progress');
        
        if (progressError) throw progressError;
        const avgProgress = avgProgressData || 0;
        
        // Fetch distribution data for charts using direct queries with counts
        // Get project types distribution
        const { data: typeData, error: typeError } = await supabase
          .from('gujrera_projects_detailed_summary')
          .select('projecttype, count:projecttype')
          .not('projecttype', 'is', null);
          
        // Since .group() is not available, we'll handle counts client-side
        if (typeError) throw typeError;
        
        const projectsByType: Record<string, number> = {};
        typeData.forEach((item: any) => {
          const type = item.projecttype || 'Unknown';
          projectsByType[type] = (projectsByType[type] || 0) + 1;
        });
        
        // Get project statuses distribution
        const { data: statusData, error: statusError } = await supabase
          .from('gujrera_projects_detailed_summary')
          .select('projectstatus')
          .not('projectstatus', 'is', null);
          
        if (statusError) throw statusError;
        
        const projectsByStatus: Record<string, number> = {};
        statusData.forEach((item: any) => {
          const status = item.projectstatus || 'Unknown';
          projectsByStatus[status] = (projectsByStatus[status] || 0) + 1;
        });
        
        // Get project locations distribution
        const { data: locationData, error: locationError } = await supabase
          .from('gujrera_projects_detailed_summary')
          .select('distname')
          .not('distname', 'is', null);
        
        if (locationError) throw locationError;
        
        const projectsByLocation: Record<string, number> = {};
        locationData.forEach((item: any) => {
          const location = item.distname || 'Unknown';
          projectsByLocation[location] = (projectsByLocation[location] || 0) + 1;
        });
        
        // Sort and limit locations to top 15
        const sortedLocations = Object.entries(projectsByLocation)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15)
          .reduce<Record<string, number>>((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {});
        
        // Get financial summary using RPC functions
        const { data: receivedAmountData, error: receivedError } = await supabase
          .rpc('get_total_received_amount');
        
        if (receivedError) throw receivedError;
        const receivedAmount = receivedAmountData || 0;
        
        // Get total area of land using RPC function
        const { data: totalAreaData, error: areaError } = await supabase
          .rpc('get_total_area_of_land');
          
        if (areaError) throw areaError;
        const totalArea = totalAreaData || 0;
        
        // Use the actual values from the database for the summary
        return {
          totalProjects: totalProjects,
          totalValue: totalValue,
          totalArea: totalArea,
          avgBookingPercentage: avgBookingPercentage,
          avgProgress: avgProgress,
          projectsByType: projectsByType,
          projectsByStatus: projectsByStatus,
          projectsByLocation: sortedLocations,
          financialSummary: {
            totalValue: totalValue,
            receivedAmount: receivedAmount,
            avgCollectionPercentage: totalValue > 0 ? (receivedAmount / totalValue) * 100 : 0
          }
        };
      } catch (error) {
        console.error("Error fetching project summary:", error);
        toast({
          title: "Error",
          description: "Failed to load project summary data",
          variant: "destructive"
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });
};

/**
 * Custom hook to fetch a single project by ID
 */
export const useProjectDetailQuery = (id: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('gujrera_projects_detailed_summary')
          .select('*')
          .eq('projectregid', parseInt(id)) // Convert string to number
          .single();
          
        if (error) throw error;
        
        // Transform the data to our application model
        return transformProjectData(data);
      } catch (error) {
        console.error(`Error fetching project ${id}:`, error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive"
        });
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });
};
