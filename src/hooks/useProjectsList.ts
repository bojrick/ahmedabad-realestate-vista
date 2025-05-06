
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectData, ProjectFilters } from "@/types/project";
import { useToast } from "@/hooks/use-toast";
import { transformProjectData } from "@/adapters/projectsAdapter";

// Number of items to load per page
const PAGE_SIZE = 12;

/**
 * Custom hook to fetch paginated projects with filters
 */
export const useProjectsQuery = (filters: ProjectFilters = {}) => {
  const { toast } = useToast();

  // Convert filters to query parameters
  const prepareQuery = (query: any) => {
    let baseQuery = query.from('gujrera_projects_detailed_summary').select('*', { count: 'exact' });
    
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
    
    return baseQuery;
  };
  
  // Use infinite query for pagination
  const projectsQuery = useInfiniteQuery({
    queryKey: ['projects', filters],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        // Prepare base query with filters
        const query = prepareQuery(supabase);
        
        // Add pagination and sort by rerasubmissiondate in descending order
        const { data, error, count } = await query
          .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1)
          .order('rerasubmissiondate', { ascending: false, nullsLast: true });
        
        if (error) throw error;
        
        // Transform the data to our application model
        const transformedData = data.map(transformProjectData);
        
        return {
          projects: transformedData,
          nextPage: data.length === PAGE_SIZE ? pageParam + 1 : undefined,
          totalCount: count || 0
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
    totalCount: projectsQuery.data?.pages[0]?.totalCount || 0
  };
};
