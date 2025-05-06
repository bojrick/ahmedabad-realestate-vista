
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectSummary } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

// The known total count of projects
const TOTAL_PROJECTS_COUNT = 15000;

/**
 * Custom hook to fetch project summary statistics directly from database
 */
export const useProjectSummaryQuery = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['projectSummary'],
    queryFn: async () => {
      try {
        // 1. Market Overview Metrics
        // Get total project count using RPC function
        const { data: countData, error: countError } = await supabase
          .rpc('get_total_projects_count');
        
        if (countError) throw countError;
        const totalProjects = countData || TOTAL_PROJECTS_COUNT;
        
        // Get active and completed project counts
        const { data: activeProjectsData, error: activeError } = await supabase
          .from('gujrera_projects_detailed_summary')
          .select('projectregid', { count: 'exact' })
          .in('projectstatus', ['Registered', 'Under Construction']);
          
        if (activeError) throw activeError;
        const activeProjects = activeProjectsData ? activeProjectsData.length : 0;
        
        const { data: completedProjectsData, error: completedError } = await supabase
          .from('gujrera_projects_detailed_summary')
          .select('projectregid', { count: 'exact' })
          .eq('projectstatus', 'Completed');
          
        if (completedError) throw completedError;
        const completedProjects = completedProjectsData ? completedProjectsData.length : 0;

        // Get total project value and actual spend
        const { data: totalValueData, error: valueError } = await supabase
          .rpc('get_total_project_value');
        
        if (valueError) throw valueError;
        const totalValue = totalValueData || 0;
        
        // Get total actual spend
        const { data: totalSpendData, error: spendError } = await supabase
          .from('gujrera_projects_detailed_summary')
          .select('totalcostincurredandpaid');
          
        if (spendError) throw spendError;
        const totalSpend = totalSpendData.reduce((sum, item) => sum + (item.totalcostincurredandpaid || 0), 0);

        // Get average booking percentage and collection percentage
        const { data: avgBookingData, error: bookingError } = await supabase
          .rpc('get_avg_booking_percentage');
        
        if (bookingError) throw bookingError;
        const avgBookingPercentage = avgBookingData || 0;
        
        // Get average collection percentage
        const { data: collectionData, error: collectionError } = await supabase
          .from('gujrera_projects_detailed_summary')
          .select('payment_collection_percentage');
          
        if (collectionError) throw collectionError;
        const avgCollectionPercentage = collectionData.length > 0 
          ? collectionData.reduce((sum, item) => sum + (item.payment_collection_percentage || 0), 0) / collectionData.length 
          : 0;

        // Get average project progress
        const { data: avgProgressData, error: progressError } = await supabase
          .rpc('get_avg_project_progress');
        
        if (progressError) throw progressError;
        const avgProgress = avgProgressData || 0;
        
        return await collectProjectSummaryData(
          totalProjects, 
          activeProjects, 
          completedProjects, 
          totalValue, 
          totalSpend, 
          avgBookingPercentage, 
          avgCollectionPercentage, 
          avgProgress
        );
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
 * Helper function to collect all project summary data
 */
async function collectProjectSummaryData(
  totalProjects: number,
  activeProjects: number,
  completedProjects: number,
  totalValue: number,
  totalSpend: number,
  avgBookingPercentage: number,
  avgCollectionPercentage: number,
  avgProgress: number
): Promise<ProjectSummary> {
  // 2. Project Pipeline Breakdown
  // Fetch data for project status distribution
  const { data: statusData, error: statusError } = await supabase
    .from('gujrera_projects_detailed_summary')
    .select('projectstatus');
    
  if (statusError) throw statusError;
  
  const projectsByStatus: Record<string, number> = {};
  statusData.forEach((item: any) => {
    const status = item.projectstatus || 'Unknown';
    projectsByStatus[status] = (projectsByStatus[status] || 0) + 1;
  });
  
  // Fetch data for project type distribution
  const { data: typeData, error: typeError } = await supabase
    .from('gujrera_projects_detailed_summary')
    .select('projecttype');
    
  if (typeError) throw typeError;
  
  const projectsByType: Record<string, number> = {};
  typeData.forEach((item: any) => {
    const type = item.projecttype || 'Unknown';
    projectsByType[type] = (projectsByType[type] || 0) + 1;
  });
  
  // Fetch data for promoter type distribution
  const { data: promoterData, error: promoterError } = await supabase
    .from('gujrera_projects_detailed_summary')
    .select('promotertype');
    
  if (promoterError) throw promoterError;
  
  const projectsByPromoterType: Record<string, number> = {};
  promoterData.forEach((item: any) => {
    const promoterType = item.promotertype || 'Unknown';
    projectsByPromoterType[promoterType] = (projectsByPromoterType[promoterType] || 0) + 1;
  });
  
  // 3. Financial Health Metrics
  // Get land and development costs - we need to adjust this to use only available columns
  const { data: financialData, error: financialError } = await supabase
    .from('gujrera_projects_detailed_summary')
    .select(`
      subtotaloflandcosta,
      subtotofdevelopcosta,
      paymentoftaxesa,
      paymentoftaxesb,
      amountofpremiumpayablea,
      amountofpremiumpayableb,
      interestpayabletofinancea,
      interestpayabletofinanceb,
      amtwithdrawntilldateofthiscerti,
      amttobedepositedindesigacc,
      totalcostincurredandpaid,
      totalestimatedcostoftherealestateproject
    `);
    
  if (financialError) throw financialError;
  
  // Calculate financial health metrics
  let totalLandCost = 0;
  let totalDevCost = 0;
  let totalTaxesAndPremiums = 0;
  let totalInterestCharges = 0;
  let totalNetCashFlow = 0;
  let costVarianceSum = 0;
  let costVarianceCount = 0;
  
  financialData.forEach(item => {
    // Land costs - only using subtotaloflandcosta since subtotaloflandcostb doesn't exist
    totalLandCost += (item.subtotaloflandcosta || 0);
    
    // Development costs - only using subtotofdevelopcosta since subtotofdevelopcostb doesn't exist
    totalDevCost += (item.subtotofdevelopcosta || 0);
    
    // Taxes and premiums
    totalTaxesAndPremiums += (item.paymentoftaxesa || 0) + (item.paymentoftaxesb || 0) +
                             (item.amountofpremiumpayablea || 0) + (item.amountofpremiumpayableb || 0);
    
    // Interest charges
    totalInterestCharges += (item.interestpayabletofinancea || 0) + (item.interestpayabletofinanceb || 0);
    
    // Net cash flow
    totalNetCashFlow += (item.amtwithdrawntilldateofthiscerti || 0) - (item.amttobedepositedindesigacc || 0);
    
    // Cost variance calculation
    if (item.totalestimatedcostoftherealestateproject && item.totalcostincurredandpaid) {
      const variance = (item.totalcostincurredandpaid - item.totalestimatedcostoftherealestateproject) /
                       Math.max(1, item.totalestimatedcostoftherealestateproject);
      costVarianceSum += variance;
      costVarianceCount++;
    }
  });
  
  const avgCostVariance = costVarianceCount > 0 ? (costVarianceSum / costVarianceCount) * 100 : 0;
  
  // 4. Sales & Booking Performance
  // Get total units vs booked units
  const { data: unitsData, error: unitsError } = await supabase
    .from('gujrera_projects_detailed_summary')
    .select('total_units, booked_flats, total_received_amount');
    
  if (unitsError) throw unitsError;
  
  const totalUnits = unitsData.reduce((sum, item) => sum + (item.total_units || 0), 0);
  const bookedUnits = unitsData.reduce((sum, item) => sum + (item.booked_flats || 0), 0);
  const totalRevenue = unitsData.reduce((sum, item) => sum + (item.total_received_amount || 0), 0);
  const revenuePerUnit = bookedUnits > 0 ? totalRevenue / bookedUnits : 0;
  
  // 5. Project Velocity & Schedule
  // Calculate average project duration
  const { data: durationData, error: durationError } = await supabase
    .from('gujrera_projects_detailed_summary')
    .select('startdate, completiondate')
    .not('startdate', 'is', null)
    .not('completiondate', 'is', null);
    
  if (durationError) throw durationError;
  
  let totalDurationDays = 0;
  let projectWithDatesCount = 0;
  
  durationData.forEach(item => {
    if (item.startdate && item.completiondate) {
      const start = new Date(item.startdate);
      const end = new Date(item.completiondate);
      const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (durationDays > 0) {
        totalDurationDays += durationDays;
        projectWithDatesCount++;
      }
    }
  });
  
  const avgProjectDuration = projectWithDatesCount > 0 ? totalDurationDays / projectWithDatesCount : 0;
  
  // 6. Geographic Distribution
  // Get projects by location (district)
  const { data: locationData, error: locationError } = await supabase
    .from('gujrera_projects_detailed_summary')
    .select('distname, booking_percentage');
  
  if (locationError) throw locationError;
  
  // Calculate projects by location and avg booking % by location
  const projectsByLocation: Record<string, number> = {};
  const bookingByLocation: Record<string, { sum: number; count: number }> = {};
  
  locationData.forEach((item: any) => {
    const location = item.distname || 'Unknown';
    
    // Count projects by location
    projectsByLocation[location] = (projectsByLocation[location] || 0) + 1;
    
    // Calculate sum and count for booking percentage by location
    if (item.booking_percentage) {
      if (!bookingByLocation[location]) {
        bookingByLocation[location] = { sum: 0, count: 0 };
      }
      bookingByLocation[location].sum += item.booking_percentage;
      bookingByLocation[location].count++;
    }
  });
  
  // Calculate average booking percentage by location
  const avgBookingByLocation: Record<string, number> = {};
  Object.keys(bookingByLocation).forEach(location => {
    const { sum, count } = bookingByLocation[location];
    avgBookingByLocation[location] = count > 0 ? sum / count : 0;
  });
  
  // Sort and limit locations to top 15
  const sortedLocations = Object.entries(projectsByLocation)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .reduce<Record<string, number>>((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  
  // 7. Consultant & Promoter Insights
  // Get top promoters by project count
  const { data: promotersData, error: promotersError } = await supabase
    .from('gujrera_projects_detailed_summary')
    .select('promotername');
    
  if (promotersError) throw promotersError;
  
  // Count projects by promoter
  const projectsByPromoter: Record<string, number> = {};
  promotersData.forEach((item: any) => {
    const promoter = item.promotername || 'Unknown';
    projectsByPromoter[promoter] = (projectsByPromoter[promoter] || 0) + 1;
  });
  
  // Sort and get top 10 promoters
  const top10Promoters = Object.entries(projectsByPromoter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .reduce<Record<string, number>>((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  
  // Get average architect and engineer scores
  const { data: scoresData, error: scoresError } = await supabase
    .from('gujrera_projects_detailed_summary')
    .select('archscore, enggscore');
    
  if (scoresError) throw scoresError;
  
  let totalArchScore = 0;
  let archScoreCount = 0;
  let totalEngScore = 0;
  let engScoreCount = 0;
  
  scoresData.forEach(item => {
    if (item.archscore && !isNaN(parseFloat(item.archscore))) {
      totalArchScore += parseFloat(item.archscore);
      archScoreCount++;
    }
    if (item.enggscore && !isNaN(parseFloat(item.enggscore))) {
      totalEngScore += parseFloat(item.enggscore);
      engScoreCount++;
    }
  });
  
  const avgArchScore = archScoreCount > 0 ? totalArchScore / archScoreCount : 0;
  const avgEngScore = engScoreCount > 0 ? totalEngScore / engScoreCount : 0;
  
  // Build the complete project summary
  return {
    // Market Overview
    totalProjects: totalProjects,
    activeProjects: activeProjects,
    completedProjects: completedProjects,
    totalValue: totalValue,
    totalSpend: totalSpend,
    avgBookingPercentage: avgBookingPercentage,
    avgCollectionPercentage: avgCollectionPercentage,
    avgProgress: avgProgress,
    
    // Project Pipeline
    projectsByStatus: projectsByStatus,
    projectsByType: projectsByType,
    projectsByPromoterType: projectsByPromoterType,
    
    // Financial Health
    financials: {
      landCost: totalLandCost,
      developmentCost: totalDevCost,
      taxesAndPremiums: totalTaxesAndPremiums,
      interestCharges: totalInterestCharges,
      netCashFlow: totalNetCashFlow,
      avgCostVariance: avgCostVariance
    },
    
    // Sales & Booking
    salesPerformance: {
      totalUnits: totalUnits,
      bookedUnits: bookedUnits,
      totalValue: totalValue,
      receivedAmount: totalRevenue,
      avgCollectionPercentage: avgCollectionPercentage,
      revenuePerUnit: revenuePerUnit
    },
    
    // Project Velocity
    projectVelocity: {
      avgProjectDuration: avgProjectDuration
    },
    
    // Geographic Distribution
    projectsByLocation: sortedLocations,
    avgBookingByLocation: avgBookingByLocation,
    
    // Consultant & Promoter Insights
    topPromoters: top10Promoters,
    avgArchScore: avgArchScore,
    avgEngScore: avgEngScore
  };
}
