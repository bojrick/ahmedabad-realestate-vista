
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectData, ProjectFilters } from "@/types/project";
import { useToast } from "@/hooks/use-toast";
import { transformProjectData, calculateProjectsSummary } from "@/adapters/projectsAdapter";

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
        const { data, error, count } = await query
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
    totalCount: TOTAL_PROJECTS_COUNT // Return the known total count
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
        // Get total project count using direct query
        const { count: totalProjectsCount, error: countError } = await supabase
          .from('gujrera_projects_detailed_summary')
          .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;

        // Get total project value using direct aggregation
        const { data: totalValueData, error: valueError } = await supabase
          .rpc('get_total_project_value');
        
        if (valueError) throw valueError;
        const totalValue = totalValueData || 0;

        // Get average booking percentage
        const { data: avgBookingData, error: bookingError } = await supabase
          .rpc('get_avg_booking_percentage');
        
        if (bookingError) throw bookingError;
        const avgBookingPercentage = avgBookingData || 0;

        // Get average project progress
        const { data: avgProgressData, error: progressError } = await supabase
          .rpc('get_avg_project_progress');
        
        if (progressError) throw progressError;
        const avgProgress = avgProgressData || 0;
        
        // Fetch distribution data for charts
        // Get project types distribution
        const { data: typeData, error: typeError } = await supabase
          .from('gujrera_projects_detailed_summary')
          .select('projecttype, count')
          .not('projecttype', 'is', null)
          .group('projecttype');
        
        if (typeError) throw typeError;
        
        const projectsByType: Record<string, number> = {};
        typeData.forEach(item => {
          projectsByType[item.projecttype || 'Unknown'] = item.count;
        });
        
        // Get project statuses distribution
        const { data: statusData, error: statusError } = await supabase
          .from('gujrera_projects_detailed_summary')
          .select('projectstatus, count')
          .not('projectstatus', 'is', null)
          .group('projectstatus');
        
        if (statusError) throw statusError;
        
        const projectsByStatus: Record<string, number> = {};
        statusData.forEach(item => {
          projectsByStatus[item.projectstatus || 'Unknown'] = item.count;
        });
        
        // Get project locations distribution
        const { data: locationData, error: locationError } = await supabase
          .from('gujrera_projects_detailed_summary')
          .select('distname, count')
          .not('distname', 'is', null)
          .group('distname')
          .order('count', { ascending: false })
          .limit(15);
        
        if (locationError) throw locationError;
        
        const projectsByLocation: Record<string, number> = {};
        locationData.forEach(item => {
          projectsByLocation[item.distname || 'Unknown'] = item.count;
        });
        
        // Get financial summary
        const { data: receivedAmountData, error: receivedError } = await supabase
          .rpc('get_total_received_amount');
        
        if (receivedError) throw receivedError;
        const receivedAmount = receivedAmountData || 0;
        
        // Use the actual values from the database for the summary
        return {
          totalProjects: totalProjectsCount || TOTAL_PROJECTS_COUNT,
          totalValue: totalValue,
          totalArea: 0, // This would need another aggregation query if needed
          avgBookingPercentage: avgBookingPercentage,
          avgProgress: avgProgress,
          projectsByType: projectsByType,
          projectsByStatus: projectsByStatus,
          projectsByLocation: projectsByLocation,
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
