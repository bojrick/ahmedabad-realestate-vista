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
 * Custom hook to fetch project summary statistics
 */
export const useProjectSummaryQuery = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['projectSummary'],
    queryFn: async () => {
      try {
        // Fetch just the fields needed for summary calculations to optimize data transfer
        const { data, error } = await supabase
          .from('gujrera_projects_detailed_summary')
          .select(`
            projectregid, projecttype, projectstatus, distname, 
            projectprogress, total_units, booked_flats,
            total_unit_consideration, total_received_amount
          `)
          .limit(2000); // Increased this limit to get better representation of data
          
        if (error) throw error;
        
        // Create minimal project objects with just the fields needed for summary calculations
        const minimalProjects = data.map(item => ({
          id: (item.projectregid !== undefined) ? item.projectregid.toString() : '',
          name: '',
          promoter: '',
          type: item.projecttype || 'Unknown',
          status: item.projectstatus || 'Unknown',
          progress: parseFloat(item.projectprogress || '0'),
          location: item.distname || '',
          coordinates: null,
          address: '',
          area: {
            total: 0,
            carpet: 0,
            built: 0,
            balcony: 0,
          },
          units: {
            total: item.total_units || 0,
            booked: item.booked_flats || 0,
            residential: 0,
            commercial: 0,
            bookingPercentage: item.booked_flats && item.total_units ? 
              (item.booked_flats / item.total_units) * 100 : 0
          },
          financials: {
            totalValue: item.total_unit_consideration || 0,
            receivedAmount: item.total_received_amount || 0,
            collectionPercentage: item.total_received_amount && item.total_unit_consideration ? 
              (item.total_received_amount / item.total_unit_consideration) * 100 : 0,
            constructionCost: 0,
            landCost: 0
          },
          dates: {
            start: null,
            completion: null,
            lastUpdated: null
          }
        }));
        
        // Calculate summary with the data retrieved
        const summary = calculateProjectsSummary(minimalProjects);
        
        // Set the total projects count to the known value
        summary.totalProjects = TOTAL_PROJECTS_COUNT;
        
        return summary;
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
