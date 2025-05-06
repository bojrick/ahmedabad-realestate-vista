import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectSummary, getProjectStatusFromProgress } from "@/types/project";
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
        
        // Get project progress data to determine status
        const { data: projectStatusData, error: progressError } = await supabase
          .from('gujrera_projects_detailed_summary')
          .select('projectprogress, projectregid');
          
        if (progressError) throw progressError;
        
        // Count projects by new status classification
        let activeProjects = 0;
        let completedProjects = 0;
        let delayedProjects = 0;
        let unreportedProjects = 0;
        
        projectStatusData.forEach(project => {
          const status = getProjectStatusFromProgress(project.projectprogress);
          switch (status) {
            case 'active': activeProjects++; break;
            case 'completed': completedProjects++; break;
            case 'delayed': delayedProjects++; break;
            case 'unreported': unreportedProjects++; break;
          }
        });
        
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
        const { data: avgProgressData, error: progressDataError } = await supabase
          .rpc('get_avg_project_progress');
        
        if (progressDataError) throw progressDataError;
        const avgProgress = avgProgressData || 0;
        
        // 2. Year-over-Year Data
        // For this we need to get data from a year ago - we'll simulate this with a multiplier
        // In a real implementation, this would query historical data tables or snapshots
        const simulateYoyChange = (value: number, min: number = -15, max: number = 15) => {
          // Generate a random percentage change between min and max percent
          const percentChange = Math.random() * (max - min) + min;
          return parseFloat(percentChange.toFixed(1));
        };
        
        // Generate YoY changes for key metrics
        const yoyChanges = {
          totalProjects: simulateYoyChange(totalProjects, 5, 20), // Generally growing
          activeProjects: simulateYoyChange(activeProjects, 0, 10),
          completedProjects: simulateYoyChange(completedProjects, -5, 15),
          totalValue: simulateYoyChange(totalValue, 10, 30), // Value tends to grow
          avgBookingPercentage: simulateYoyChange(avgBookingPercentage, -8, 8),
          avgProgress: simulateYoyChange(avgProgress, -5, 5)
        };
        
        // 3. Collect remaining project summary data
        return await collectProjectSummaryData(
          totalProjects, 
          activeProjects, 
          completedProjects,
          delayedProjects,
          unreportedProjects,
          totalValue, 
          totalSpend, 
          avgBookingPercentage, 
          avgCollectionPercentage, 
          avgProgress,
          yoyChanges
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
  delayedProjects: number,
  unreportedProjects: number,
  totalValue: number,
  totalSpend: number,
  avgBookingPercentage: number,
  avgCollectionPercentage: number,
  avgProgress: number,
  yoyChanges: any
): Promise<ProjectSummary> {
  // Simulation function for YoY changes
  const simulateYoyChange = (value: number, min: number = -15, max: number = 15) => {
    const percentChange = Math.random() * (max - min) + min;
    return parseFloat(percentChange.toFixed(1));
  };

  // 2. Project Pipeline Breakdown
  // Fetch data for project status distribution
  const { data: statusData, error: statusError } = await supabase
    .from('gujrera_projects_detailed_summary')
    .select('projectprogress');
    
  if (statusError) throw statusError;
  
  const projectsByStatus: Record<string, number> = {
    'Active': activeProjects,
    'Completed': completedProjects,
    'Delayed': delayedProjects,
    'Unreported': unreportedProjects
  };
  
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
  // Get land and development costs
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
    // Land costs - only using subtotaloflandcosta
    totalLandCost += (item.subtotaloflandcosta || 0);
    
    // Development costs - only using subtotofdevelopcosta
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
  
  // Generate YoY changes for financial metrics
  const financialsYoY = {
    yoyLandCost: simulateYoyChange(totalLandCost, 5, 20),
    yoyDevelopmentCost: simulateYoyChange(totalDevCost, 8, 25),
    yoyCostVariance: simulateYoyChange(avgCostVariance, -5, 10)
  };
  
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
  
  // Generate YoY changes for sales metrics
  const salesYoY = {
    yoyBookedUnits: simulateYoyChange(bookedUnits, -5, 15),
    yoyReceivedAmount: simulateYoyChange(totalRevenue, 8, 30),
    yoyCollectionPercentage: simulateYoyChange(avgCollectionPercentage, -8, 8)
  };
  
  // 5. Project Velocity & Schedule
  // Calculate average project duration
  const { data: durationData, error: durationError } = await supabase
    .from('gujrera_projects_detailed_summary')
    .select('startdate, completiondate, projectprogress')
    .not('startdate', 'is', null)
    .not('completiondate', 'is', null);
    
  if (durationError) throw durationError;
  
  let totalDurationDays = 0;
  let projectWithDatesCount = 0;
  let completedOnTime = 0;
  let completedDelayed = 0;
  
  durationData.forEach(item => {
    if (item.startdate && item.completiondate) {
      const start = new Date(item.startdate);
      const end = new Date(item.completiondate);
      const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      if (durationDays > 0) {
        totalDurationDays += durationDays;
        projectWithDatesCount++;
        
        // Check if completed on time or delayed
        const status = getProjectStatusFromProgress(item.projectprogress);
        if (status === 'completed') {
          completedOnTime++;
        } else if (status === 'delayed') {
          completedDelayed++;
        }
      }
    }
  });
  
  const avgProjectDuration = projectWithDatesCount > 0 ? totalDurationDays / projectWithDatesCount : 0;
  const yoyAvgProjectDuration = simulateYoyChange(avgProjectDuration, -5, 15);
  
  // Get upcoming completions (projects completing in next 6 months)
  // This would require more data transformation, we'll leave it as a placeholder
  
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
  
  // Generate YoY changes for location metrics
  const yoyProjectsByLocation: Record<string, number> = {};
  Object.keys(projectsByLocation).forEach(location => {
    yoyProjectsByLocation[location] = simulateYoyChange(projectsByLocation[location], -10, 20);
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
  
  // Generate YoY changes for consultant metrics
  const yoyAvgArchScore = simulateYoyChange(avgArchScore, -10, 10);
  const yoyAvgEngScore = simulateYoyChange(avgEngScore, -10, 10);
  
  // Build the complete project summary
  return {
    // Market Overview
    totalProjects: totalProjects,
    totalValue: totalValue,
    totalArea: totalArea || 0,
    avgBookingPercentage: avgBookingPercentage,
    avgProgress: avgProgress,
    activeProjects: activeProjects,
    completedProjects: completedProjects,
    delayedProjects: delayedProjects,
    unreportedProjects: unreportedProjects,
    totalSpend: totalSpend,
    avgCollectionPercentage: avgCollectionPercentage,
    
    // Year over Year changes
    yoyChanges: yoyChanges,
    
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
      avgCostVariance: avgCostVariance,
      yoyLandCost: financialsYoY.yoyLandCost,
      yoyDevelopmentCost: financialsYoY.yoyDevelopmentCost,
      yoyCostVariance: financialsYoY.yoyCostVariance
    },
    
    // Sales & Booking
    salesPerformance: {
      totalUnits: totalUnits,
      bookedUnits: bookedUnits,
      totalValue: totalValue,
      receivedAmount: totalRevenue,
      avgCollectionPercentage: avgCollectionPercentage,
      revenuePerUnit: revenuePerUnit,
      yoyBookedUnits: salesYoY.yoyBookedUnits,
      yoyReceivedAmount: salesYoY.yoyReceivedAmount,
      yoyCollectionPercentage: salesYoY.yoyCollectionPercentage
    },
    
    // Project Velocity
    projectVelocity: {
      avgProjectDuration: avgProjectDuration,
      yoyAvgProjectDuration: yoyAvgProjectDuration,
      completedOnTime: completedOnTime,
      completedDelayed: completedDelayed
    },
    
    // Geographic Distribution
    projectsByLocation: sortedLocations,
    
    // Add required properties from the ProjectSummary interface
    financialSummary: {
      totalValue: totalValue,
      receivedAmount: totalRevenue,
      avgCollectionPercentage: avgCollectionPercentage
    },
    
    // Consultant & Promoter Insights
    avgArchScore: avgArchScore,
    avgEngScore: avgEngScore,
    yoyAvgArchScore: yoyAvgArchScore,
    yoyAvgEngScore: yoyAvgEngScore
  };
}
