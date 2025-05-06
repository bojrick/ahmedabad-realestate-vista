
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { transformProjectData } from "@/adapters/projectsAdapter";

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
          .eq('projectregid', id) // Remove parseInt to avoid conversion issues
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
