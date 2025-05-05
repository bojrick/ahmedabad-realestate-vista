
import { supabase } from "@/integrations/supabase/client";
import { ProjectData, ProjectSummary, ProjectLocation } from "@/types/project";

/**
 * Fetches projects from the database
 * @returns Array of ProjectData
 */
export async function fetchProjects(): Promise<ProjectData[]> {
  try {
    const { data, error } = await supabase
      .from('gujrera_projects_detailed_summary')
      .select('*')
      .limit(500); // Limit to avoid performance issues
    
    if (error) throw error;
    
    return data.map(transformProjectData);
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

/**
 * Transforms raw Supabase project data into our application model
 * @param rawProject Raw project data from Supabase
 * @returns Formatted ProjectData object
 */
export function transformProjectData(rawProject: any): ProjectData {
  // Parse location coordinates if available
  let coordinates: ProjectLocation | null = null;
  if (rawProject.location_coordinates) {
    try {
      const coords = rawProject.location_coordinates.split(',').map(Number);
      if (coords.length === 2) {
        coordinates = {
          latitude: coords[0],
          longitude: coords[1]
        };
      }
    } catch (e) {
      console.warn(`Could not parse coordinates for project ${rawProject.projectregid}`);
    }
  }

  return {
    id: rawProject.projectregid?.toString() || '',
    name: rawProject.projectname || 'Unnamed Project',
    promoter: rawProject.promotername || 'Unknown Promoter',
    type: rawProject.projecttype || 'Unknown',
    status: rawProject.projectstatus || 'Unknown',
    progress: parseFloat(rawProject.projectprogress) || 0,
    address: rawProject.projectaddress || '',
    location: rawProject.distname || '',
    coordinates,
    area: {
      total: rawProject.totareaofland || 0,
      carpet: rawProject.total_carpet_area || 0,
      built: rawProject.total_builtup_area || 0,
      balcony: rawProject.total_balcony_area || 0,
    },
    units: {
      total: rawProject.total_units || 0,
      booked: rawProject.booked_flats || 0,
      residential: rawProject.residential_total_units || 0,
      commercial: (rawProject.shop_total_units || 0) + (rawProject.office_total_units || 0),
      bookingPercentage: parseFloat(rawProject.booking_percentage) || 0
    },
    financials: {
      totalValue: rawProject.total_unit_consideration || 0,
      receivedAmount: rawProject.total_received_amount || 0,
      collectionPercentage: parseFloat(rawProject.payment_collection_percentage) || 0,
      constructionCost: rawProject.estcostofconstructascertifybyenga || 0,
      landCost: rawProject.acquisitioncostoflanda || 0
    },
    dates: {
      start: rawProject.startdate ? new Date(rawProject.startdate) : null,
      completion: rawProject.completiondate ? new Date(rawProject.completiondate) : null,
      lastUpdated: rawProject.data_updated_at ? new Date(rawProject.data_updated_at) : null
    }
  };
}

/**
 * Calculates summary statistics from project data
 */
export function calculateProjectsSummary(projects: ProjectData[]): ProjectSummary {
  if (!projects || projects.length === 0) {
    return {
      totalProjects: 0,
      totalValue: 0,
      totalArea: 0,
      avgBookingPercentage: 0,
      avgProgress: 0,
      projectsByType: {},
      projectsByStatus: {},
      projectsByLocation: {},
      financialSummary: {
        totalValue: 0,
        receivedAmount: 0,
        avgCollectionPercentage: 0
      }
    };
  }

  // Calculate aggregated statistics
  const totalProjects = projects.length;
  const totalValue = projects.reduce((sum, p) => sum + p.financials.totalValue, 0);
  const totalArea = projects.reduce((sum, p) => sum + p.area.total, 0);
  
  const bookingPercentages = projects.filter(p => p.units.bookingPercentage > 0).map(p => p.units.bookingPercentage);
  const avgBookingPercentage = bookingPercentages.length > 0 
    ? bookingPercentages.reduce((sum, p) => sum + p, 0) / bookingPercentages.length 
    : 0;
  
  const progressValues = projects.filter(p => p.progress > 0).map(p => p.progress);
  const avgProgress = progressValues.length > 0 
    ? progressValues.reduce((sum, p) => sum + p, 0) / progressValues.length 
    : 0;
  
  // Group by type
  const projectsByType: Record<string, number> = {};
  projects.forEach(p => {
    const type = p.type || 'Unknown';
    projectsByType[type] = (projectsByType[type] || 0) + 1;
  });
  
  // Group by status
  const projectsByStatus: Record<string, number> = {};
  projects.forEach(p => {
    const status = p.status || 'Unknown';
    projectsByStatus[status] = (projectsByStatus[status] || 0) + 1;
  });
  
  // Group by location - limit to top locations for performance
  const locationCounts: {location: string, count: number}[] = [];
  projects.forEach(p => {
    const location = p.location || 'Unknown';
    const existing = locationCounts.find(item => item.location === location);
    if (existing) {
      existing.count++;
    } else {
      locationCounts.push({ location, count: 1 });
    }
  });
  
  // Convert to record and take top locations
  const projectsByLocation: Record<string, number> = {};
  locationCounts
    .sort((a, b) => b.count - a.count)
    .slice(0, 15) // Limit to top 15 locations for better performance
    .forEach(item => {
      projectsByLocation[item.location] = item.count;
    });
  
  // Financial summary
  const receivedAmount = projects.reduce((sum, p) => sum + p.financials.receivedAmount, 0);
  const collectionPercentages = projects.filter(p => p.financials.collectionPercentage > 0).map(p => p.financials.collectionPercentage);
  const avgCollectionPercentage = collectionPercentages.length > 0 
    ? collectionPercentages.reduce((sum, p) => sum + p, 0) / collectionPercentages.length 
    : 0;
  
  return {
    totalProjects,
    totalValue,
    totalArea,
    avgBookingPercentage,
    avgProgress,
    projectsByType,
    projectsByStatus,
    projectsByLocation,
    financialSummary: {
      totalValue,
      receivedAmount,
      avgCollectionPercentage
    }
  };
}

/**
 * Fetches projects with optimized pagination
 */
export async function fetchPaginatedProjects(
  page: number = 0, 
  pageSize: number = 12,
  filters: any = {}
): Promise<{ data: ProjectData[], count: number }> {
  try {
    let query = supabase.from('gujrera_projects_detailed_summary').select('*', { count: 'exact' });
    
    // Apply filters
    if (filters.type && filters.type.length) {
      query = query.in('projecttype', filters.type);
    }
    
    if (filters.status && filters.status.length) {
      query = query.in('projectstatus', filters.status);
    }
    
    if (filters.location && filters.location.length) {
      query = query.in('distname', filters.location);
    }
    
    // Add pagination
    const { data, error, count } = await query
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order('projectregid', { ascending: false });
    
    if (error) throw error;
    
    return {
      data: data.map(transformProjectData),
      count: count || 0
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}
