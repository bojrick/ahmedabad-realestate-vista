import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectSummary, getProjectStatusFromProgress } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

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
        const totalProjects = countData || 0;
        
        // Get project progress data to determine status - use chunked fetching to avoid 1000 item limit
        let allProjectStatusData: any[] = [];
        let hasMore = true;
        let page = 0;
        const pageSize = 1000; // Supabase maximum limit per request
        
        while (hasMore) {
          const { data: chunk, error: progressError, count } = await supabase
            .from('gujrera_projects_detailed_summary')
            .select('projectprogress, projectregid', { count: 'exact' })
            .range(page * pageSize, (page + 1) * pageSize - 1);
            
          if (progressError) throw progressError;
          
          allProjectStatusData = [...allProjectStatusData, ...chunk];
          
          // Check if we've fetched all records
          if (chunk.length < pageSize) {
            hasMore = false;
          } else {
            page++;
          }
        }
        
        // Count projects by new status classification
        let activeProjects = 0;
        let completedProjects = 0;
        let delayedProjects = 0;
        let unreportedProjects = 0;
        
        allProjectStatusData.forEach(project => {
          const status = getProjectStatusFromProgress(project.projectprogress);
          switch (status) {
            case 'active': activeProjects++; break;
            case 'completed': completedProjects++; break;
            case 'delayed': delayedProjects++; break;
            case 'unreported': unreportedProjects++; break;
          }
        });
        
        console.log(`Total projects analyzed: ${allProjectStatusData.length}`);
        
        // Get total project value and actual spend
        const { data: totalValueData, error: valueError } = await supabase
          .rpc('get_total_project_value');
        
        if (valueError) throw valueError;
        const totalValue = totalValueData || 0;
        
        // Get total actual spend - using paginated fetching
        let allSpendData: any[] = [];
        hasMore = true;
        page = 0;
        
        while (hasMore) {
          const { data: chunk, error: spendError } = await supabase
            .from('gujrera_projects_detailed_summary')
            .select('totalcostincurredandpaid')
            .range(page * pageSize, (page + 1) * pageSize - 1);
            
          if (spendError) throw spendError;
          
          allSpendData = [...allSpendData, ...chunk];
          
          if (chunk.length < pageSize) {
            hasMore = false;
          } else {
            page++;
          }
        }
        
        const totalSpend = allSpendData.reduce((sum, item) => sum + (item.totalcostincurredandpaid || 0), 0);
        
        console.log(`Spend data records analyzed: ${allSpendData.length}`);

        // Get average booking percentage
        const { data: avgBookingData, error: bookingError } = await supabase
          .rpc('get_avg_booking_percentage');
        
        if (bookingError) throw bookingError;
        const avgBookingPercentage = avgBookingData || 0;
        
        // Get average collection percentage - with pagination
        let allCollectionData: any[] = [];
        hasMore = true;
        page = 0;
        
        while (hasMore) {
          const { data: chunk, error: collectionError } = await supabase
            .from('gujrera_projects_detailed_summary')
            .select('payment_collection_percentage')
            .range(page * pageSize, (page + 1) * pageSize - 1);
            
          if (collectionError) throw collectionError;
          
          allCollectionData = [...allCollectionData, ...chunk];
          
          if (chunk.length < pageSize) {
            hasMore = false;
          } else {
            page++;
          }
        }
        
        const avgCollectionPercentage = allCollectionData.length > 0 
          ? allCollectionData.reduce((sum, item) => sum + (item.payment_collection_percentage || 0), 0) / allCollectionData.length 
          : 0;
          
        console.log(`Collection data records analyzed: ${allCollectionData.length}`);

        // Get average project progress
        const { data: avgProgressData, error: progressDataError } = await supabase
          .rpc('get_avg_project_progress');
        
        if (progressDataError) throw progressDataError;
        const avgProgress = avgProgressData || 0;
        
        // 2. Year-over-Year Data - simulated with random values as in the original
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
 * Helper function to fetch paginated data from any table
 */
async function fetchAllPaginatedData(tableName: 'gujrera_projects_detailed_summary', select: string): Promise<any[]> {
  let allData: any[] = [];
  let hasMore = true;
  let page = 0;
  const pageSize = 1000;

  while (hasMore) {
    const { data: chunk, error } = await supabase
      .from(tableName)
      .select(select)
      .range(page * pageSize, (page + 1) * pageSize - 1);
      
    if (error) throw error;
    
    allData = [...allData, ...chunk];
    
    if (chunk.length < pageSize) {
      hasMore = false;
    } else {
      page++;
    }
  }
  
  return allData;
}

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

  // 2. Project Pipeline Breakdown - fetch all status data
  const statusData = await fetchAllPaginatedData('gujrera_projects_detailed_summary', 'projectprogress');
  
  const projectsByStatus: Record<string, number> = {
    'Active': activeProjects,
    'Completed': completedProjects,
    'Delayed': delayedProjects,
    'Unreported': unreportedProjects
  };
  
  // Fetch all project type data
  const typeData = await fetchAllPaginatedData('gujrera_projects_detailed_summary', 'projecttype');
  
  const projectsByType: Record<string, number> = {};
  typeData.forEach((item: any) => {
    const type = item.projecttype || 'Unknown';
    projectsByType[type] = (projectsByType[type] || 0) + 1;
  });
  
  // Fetch all promoter type data
  const promoterData = await fetchAllPaginatedData('gujrera_projects_detailed_summary', 'promotertype');
  
  const projectsByPromoterType: Record<string, number> = {};
  promoterData.forEach((item: any) => {
    const promoterType = item.promotertype || 'Unknown';
    projectsByPromoterType[promoterType] = (projectsByPromoterType[promoterType] || 0) + 1;
  });
  
  console.log(`Processed ${typeData.length} project types and ${promoterData.length} promoter types`);
  
  // 3. Financial Health Metrics - fetch all financial data
  const financialData = await fetchAllPaginatedData('gujrera_projects_detailed_summary', `
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
  
  console.log(`Processed ${financialData.length} financial records`);
  
  // Generate YoY changes for financial metrics
  const financialsYoY = {
    yoyLandCost: simulateYoyChange(totalLandCost, 5, 20),
    yoyDevelopmentCost: simulateYoyChange(totalDevCost, 8, 25),
    yoyCostVariance: simulateYoyChange(avgCostVariance, -5, 10)
  };
  
  // 4. Sales & Booking Performance - fetch all units data
  const unitsData = await fetchAllPaginatedData('gujrera_projects_detailed_summary', 'total_units, booked_flats, total_received_amount');
  
  const totalUnits = unitsData.reduce((sum, item) => sum + (item.total_units || 0), 0);
  const bookedUnits = unitsData.reduce((sum, item) => sum + (item.booked_flats || 0), 0);
  const totalRevenue = unitsData.reduce((sum, item) => sum + (item.total_received_amount || 0), 0);
  const revenuePerUnit = bookedUnits > 0 ? totalRevenue / bookedUnits : 0;
  
  console.log(`Processed ${unitsData.length} units records`);
  
  // Generate YoY changes for sales metrics
  const salesYoY = {
    yoyBookedUnits: simulateYoyChange(bookedUnits, -5, 15),
    yoyReceivedAmount: simulateYoyChange(totalRevenue, 8, 30),
    yoyCollectionPercentage: simulateYoyChange(avgCollectionPercentage, -8, 8)
  };
  
  // 5. Project Velocity & Schedule - fetch duration data
  const durationData = await fetchAllPaginatedData('gujrera_projects_detailed_summary', 'startdate, completiondate, projectprogress');
  
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
  
  console.log(`Processed ${durationData.length} duration records, with ${projectWithDatesCount} valid durations`);
  
  // 6. Geographic Distribution - fetch location data
  const locationData = await fetchAllPaginatedData('gujrera_projects_detailed_summary', 'distname, booking_percentage');
  
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
  
  console.log(`Processed ${locationData.length} location records with ${Object.keys(projectsByLocation).length} unique locations`);
  
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
  
  // 7. Consultant & Promoter Insights - fetch promoter data
  const promotersData = await fetchAllPaginatedData('gujrera_projects_detailed_summary', 'promotername');
  
  // Count projects by promoter
  const projectsByPromoter: Record<string, number> = {};
  promotersData.forEach((item: any) => {
    const promoter = item.promotername || 'Unknown';
    projectsByPromoter[promoter] = (projectsByPromoter[promoter] || 0) + 1;
  });
  
  console.log(`Processed ${promotersData.length} promoter records`);
  
  // Sort and get top 10 promoters
  const top10Promoters = Object.entries(projectsByPromoter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .reduce<Record<string, number>>((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  
  // Get average architect and engineer scores
  const scoresData = await fetchAllPaginatedData('gujrera_projects_detailed_summary', 'archscore, enggscore');
  
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
  
  console.log(`Processed ${scoresData.length} score records (${archScoreCount} arch, ${engScoreCount} eng)`);
  
  // Generate YoY changes for consultant metrics
  const yoyAvgArchScore = simulateYoyChange(avgArchScore, -10, 10);
  const yoyAvgEngScore = simulateYoyChange(avgEngScore, -10, 10);
  
  // Build the complete project summary
  return {
    // Market Overview
    totalProjects: totalProjects,
    activeProjects: activeProjects,
    completedProjects: completedProjects,
    delayedProjects: delayedProjects,
    unreportedProjects: unreportedProjects,
    totalValue: totalValue,
    totalSpend: totalSpend,
    avgBookingPercentage: avgBookingPercentage,
    avgCollectionPercentage: avgCollectionPercentage,
    avgProgress: avgProgress,
    
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
    avgBookingByLocation: avgBookingByLocation,
    yoyProjectsByLocation: yoyProjectsByLocation,
    
    // Consultant & Promoter Insights
    topPromoters: top10Promoters,
    avgArchScore: avgArchScore,
    avgEngScore: avgEngScore,
    yoyAvgArchScore: yoyAvgArchScore,
    yoyAvgEngScore: yoyAvgEngScore
  };
}
