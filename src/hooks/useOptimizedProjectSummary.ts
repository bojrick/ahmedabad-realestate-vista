
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectSummary } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook to fetch optimized project summary statistics 
 * using database views and aggregate functions
 */
export const useOptimizedProjectSummary = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['optimizedProjectSummary'],
    queryFn: async () => {
      try {
        // Fetch from the project_status_summary view
        const { data: statusData, error: statusError } = await supabase
          .from('project_status_summary')
          .select('*')
          .single();
        
        if (statusError) throw statusError;
        
        // Fetch projects by type from the project_types_summary view
        const { data: typesData, error: typesError } = await supabase
          .from('project_types_summary')
          .select('*');
        
        if (typesError) throw typesError;
        
        // Build projectsByType object
        const projectsByType: Record<string, number> = {};
        typesData.forEach(item => {
          projectsByType[item.projecttype || 'Unknown'] = item.count;
        });
        
        // Fetch projects by status
        const projectsByStatus = {
          'Active': statusData.active_projects || 0,
          'Completed': statusData.completed_projects || 0,
          'Delayed': statusData.delayed_projects || 0,
          'Unreported': statusData.unreported_projects || 0
        };
        
        // Fetch projects by promoter type
        const { data: promoterTypesData, error: promoterTypesError } = await supabase
          .from('promoter_types_summary')
          .select('*');
        
        if (promoterTypesError) throw promoterTypesError;
        
        const projectsByPromoterType: Record<string, number> = {};
        promoterTypesData.forEach(item => {
          projectsByPromoterType[item.promotertype || 'Unknown'] = item.count;
        });
        
        // Fetch top promoters
        const { data: topPromotersData, error: topPromotersError } = await supabase
          .from('top_promoters_summary')
          .select('*');
        
        if (topPromotersError) throw topPromotersError;
        
        const topPromoters: Record<string, number> = {};
        topPromotersData.forEach(item => {
          topPromoters[item.promotername || 'Unknown'] = item.count;
        });
        
        // Fetch projects by location
        const { data: locationsData, error: locationsError } = await supabase
          .from('project_locations_summary')
          .select('*')
          .limit(15); // Top 15 locations
        
        if (locationsError) throw locationsError;
        
        const projectsByLocation: Record<string, number> = {};
        locationsData.forEach(item => {
          projectsByLocation[item.location || 'Unknown'] = item.count;
        });
        
        // Simulate YoY changes with random values for now
        // In a real implementation, you would compare with historical data
        const simulateYoyChange = (value: number, min: number = -15, max: number = 15) => {
          const percentChange = Math.random() * (max - min) + min;
          return parseFloat(percentChange.toFixed(1));
        };
        
        const yoyChanges = {
          totalProjects: simulateYoyChange(statusData.total_projects, 5, 20),
          activeProjects: simulateYoyChange(statusData.active_projects, 0, 10),
          completedProjects: simulateYoyChange(statusData.completed_projects, -5, 15),
          totalValue: simulateYoyChange(statusData.total_value, 10, 30),
          avgBookingPercentage: simulateYoyChange(statusData.avg_booking_percentage, -8, 8),
          avgProgress: simulateYoyChange(statusData.avg_progress, -5, 5)
        };
        
        // Return the complete project summary
        const summary: ProjectSummary = {
          totalProjects: statusData.total_projects,
          totalValue: statusData.total_value,
          totalArea: await getTotalAreaOfLand(),
          avgBookingPercentage: statusData.avg_booking_percentage,
          avgProgress: statusData.avg_progress,
          projectsByType,
          projectsByStatus,
          projectsByLocation,
          projectsByPromoterType,
          topPromoters,
          yoyChanges,
          financialSummary: {
            totalValue: statusData.total_value,
            receivedAmount: await getTotalReceivedAmount(),
            avgCollectionPercentage: statusData.avg_collection_percentage
          }
        };
        
        return summary;
      } catch (error) {
        console.error("Error fetching optimized project summary:", error);
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

// Helper function to get total area of land 
// This uses the RPC function we already have
async function getTotalAreaOfLand(): Promise<number> {
  const { data, error } = await supabase.rpc('get_total_area_of_land');
  if (error) {
    console.error("Error fetching total area of land:", error);
    return 0;
  }
  return data || 0;
}

// Helper function to get total received amount
// This uses the RPC function we already have
async function getTotalReceivedAmount(): Promise<number> {
  const { data, error } = await supabase.rpc('get_total_received_amount');
  if (error) {
    console.error("Error fetching total received amount:", error);
    return 0;
  }
  return data || 0;
}
