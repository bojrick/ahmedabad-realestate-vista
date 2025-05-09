
import { supabase } from "@/integrations/supabase/client";
import { ProjectData, ProjectSummary, ProjectLocation, getProjectStatusFromProgress } from "@/types/project";

/**
 * Fetches projects from the database
 * @returns Array of ProjectData
 */
export async function fetchProjects(): Promise<ProjectData[]> {
  try {
    const { data, error } = await supabase
      .from('gujrera_projects_detailed_summary')
      .select('*')
      .limit(2000); // Increased limit to get more representative data
    
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
    promoterType: rawProject.promotertype || undefined,
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
      lastUpdated: rawProject.data_updated_at ? new Date(rawProject.data_updated_at) : null,
      submission: rawProject.rerasubmissiondate || null,
      lastSale: rawProject.last_sale_date || null
    },
    
    // Additional fields mapped from raw data
    projectDescription: rawProject.projectdesc,
    pincode: rawProject.pincode,
    moje: rawProject.moje,
    architectName: rawProject.architect_name,
    architectAddress: rawProject.architect_address,
    engineerName: rawProject.eng_name,
    engineerAddress: rawProject.eng_address,
    tpNumber: rawProject.tpno,
    tpName: rawProject.tpname,
    place: rawProject.place,
    
    // Professional details
    architectProjects: rawProject.architect_no_projects,
    architectExperience: rawProject.architect_prof_experience,
    engineerProjects: rawProject.eng_no_projects,
    engineerExperience: rawProject.eng_prof_experience,
    architectScore: rawProject.archscore,
    engineerScore: rawProject.enggscore,
    projectScore: rawProject.score,
    tpoCode: rawProject.tpo_code,
    
    // Location details
    locationStatus: rawProject.location_status,
    airportDistance: rawProject.airportdistance,
    
    // Technical details
    landValuationMethod: rawProject.methodlandvaluation,
    underRedevelopment: rawProject.underredevelopment,
    officeName: rawProject.officename,
    processType: rawProject.processtype,
    reraSubmissionDate: rawProject.rerasubmissiondate,
    projectApprovedDate: rawProject.projectapprovedate,
    timeLapse: rawProject.timelaps,
    
    // Unit details
    officeUnits: rawProject.office_total_units,
    shopUnits: rawProject.shop_total_units,
    otherUnits: rawProject.other_total_units,
    plotUnits: rawProject.plot_total_units,
    flatUnits: rawProject.flat_total_units,
    inventoryCount: rawProject.noofinventory,
    
    // Financial and areas
    residentialCarpetArea: rawProject.residential_total_carpet_area,
    residentialBalconyArea: rawProject.residential_total_balcony_area,
    residentialUnitConsideration: rawProject.residential_total_unit_consideration,
    residentialReceivedAmount: rawProject.residential_total_received_amount,
    
    officeCarpetArea: rawProject.office_total_carpet_area,
    officeBalconyArea: rawProject.office_total_balcony_area,
    officeUnitConsideration: rawProject.office_total_unit_consideration,
    officeReceivedAmount: rawProject.office_total_received_amount,
    
    shopCarpetArea: rawProject.shop_total_carpet_area,
    shopBalconyArea: rawProject.shop_total_balcony_area,
    shopUnitConsideration: rawProject.shop_total_unit_consideration,
    shopReceivedAmount: rawProject.shop_total_received_amount,
    
    bookedCarpetArea: rawProject.booked_carpet_area,
    bookedBalconyArea: rawProject.booked_balcony_area,
    bookedUnitConsideration: rawProject.booked_unit_consideration,
    bookedReceivedAmount: rawProject.booked_received_amount,
    
    areaBookingPercentage: rawProject.area_booking_percentage,
    projectTotalLandArea: rawProject.totlandareaforprojectunderreg,
    projectTotalCarpetArea: rawProject.totcarpetareaforprojectunderreg,
    totalCoveredArea: rawProject.totcoverdarea,
    totalOpenArea: rawProject.totopenarea,
    
    // Parking details
    openParkingArea: rawProject.openparkingarea,
    coveredParkingArea: rawProject.coveredparkingarea,
    coveredParking: rawProject.coveredparking,
    parkingForSaleCount: rawProject.noofparkinfforsale,
    parkingForSaleArea: rawProject.areaofparkinfforsale,
    garageForSaleCount: rawProject.noofgarageforsale,
    garageForSaleArea: rawProject.areaofgarageforsale,
    
    // Cost details
    acquisitionCostOfLandA: rawProject.acquisitioncostoflanda,
    acquisitionCostOfLandB: rawProject.acquisitioncostoflandb,
    premiumPayableA: rawProject.amountofpremiumpayablea,
    premiumPayableB: rawProject.amountofpremiumpayableb,
    tdrAcquisitionCostA: rawProject.acquisitioncostoftdra,
    tdrAcquisitionCostB: rawProject.acquisitioncostoftdrb,
    landPremiumA: rawProject.landpremiumpayablea,
    landPremiumB: rawProject.landpremiumpayableb,
    subtotalOfLandCostA: rawProject.subtotaloflandcosta,
    
    estConstructionCostA: rawProject.estcostofconstructascertifybyenga,
    actualConstructionCostB: rawProject.actualcostofconstructincurredandpaidb,
    onsiteDevelopmentA: rawProject.onsiteexpenditurefordevelopmenta,
    onsiteDevelopmentB: rawProject.onsiteexpenditurefordevelopmentb,
    taxPaymentsA: rawProject.paymentoftaxesa,
    taxPaymentsB: rawProject.paymentoftaxesb,
    financeInterestA: rawProject.interestpayabletofinancea,
    financeInterestB: rawProject.interestpayabletofinanceb,
    
    subtotalDevelopmentCostA: rawProject.subtotofdevelopcosta,
    subtotalDevelopmentCostB: rawProject.subtotofdevelopcostb,
    totalEstimatedProjectCost: rawProject.totalestimatedcostoftherealestateproject,
    totalCostIncurredAndPaid: rawProject.totalcostincurredandpaid,
    estimatedBalanceCostToComplete: rawProject.estbalcosttocompleteproject,
    
    stateGovtAmountA: rawProject.amountspayabletostategovernmenta,
    stateGovtAmountB: rawProject.amountspayabletostategovernmentb,
    
    // Designated account details
    amountWithdrawnFromDesignatedAccount: rawProject.amtwithdrawnfromdesigaccount,
    amountWithdrawnToDate: rawProject.amtwithdrawntilldateofthiscerti,
    netAmountWithdrawnFromDesignatedAccount: rawProject.netamtwithdrawfromdesigbnkaccundercerti,
    balanceUnbookedAreaCertificate: rawProject.balunbookedareatobecerti,
    balanceReceivablesFromBookedUnits: rawProject.balamtofreceivablesfrombookedaptmnts,
    estimatedSalesProceedsForUnbookedUnits: rawProject.estamtofsalesproceedsinrespectofunbookedaptmnts,
    estimatedReceivablesOngoingProject: rawProject.estreceivablesofongoingproject,
    amountToBeDepositedInDesignatedAccount: rawProject.amttobedepositedindesigacc
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
      projectsByPromoterType: {}, // Add missing property
      topPromoters: {}, // Add missing property
      financialSummary: {
        totalValue: 0,
        receivedAmount: 0,
        avgCollectionPercentage: 0
      }
    };
  }

  // Fixed total count - this is the known total from Supabase
  const TOTAL_PROJECTS_COUNT = 15000;
  
  // Calculate aggregated statistics
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
  
  // Group by status using the new classification
  const projectsByStatus: Record<string, number> = {
    'Active': 0,
    'Completed': 0,
    'Delayed': 0,
    'Unreported': 0
  };
  
  projects.forEach(p => {
    const statusClass = getProjectStatusFromProgress(p.status);
    switch(statusClass) {
      case 'active':
        projectsByStatus['Active'] = (projectsByStatus['Active'] || 0) + 1;
        break;
      case 'completed':
        projectsByStatus['Completed'] = (projectsByStatus['Completed'] || 0) + 1;
        break;
      case 'delayed':
        projectsByStatus['Delayed'] = (projectsByStatus['Delayed'] || 0) + 1;
        break;
      case 'unreported':
        projectsByStatus['Unreported'] = (projectsByStatus['Unreported'] || 0) + 1;
        break;
    }
  });

  // Group by promoter type
  const projectsByPromoterType: Record<string, number> = {};
  projects.forEach(p => {
    const promoterType = p.promoterType || 'Unknown';
    projectsByPromoterType[promoterType] = (projectsByPromoterType[promoterType] || 0) + 1;
  });
  
  // Create top promoters map
  const promoterCounts: Record<string, number> = {};
  projects.forEach(p => {
    const promoter = p.promoter || 'Unknown';
    promoterCounts[promoter] = (promoterCounts[promoter] || 0) + 1;
  });
  
  // Get top 10 promoters
  const topPromoters = Object.entries(promoterCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .reduce<Record<string, number>>((acc, [promoter, count]) => {
      acc[promoter] = count;
      return acc;
    }, {});
  
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
    totalProjects: TOTAL_PROJECTS_COUNT, // Always use the known total count
    totalValue,
    totalArea,
    avgBookingPercentage,
    avgProgress,
    projectsByType,
    projectsByStatus,
    projectsByLocation,
    projectsByPromoterType, // Add the missing property
    topPromoters, // Add the missing property
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
    
    if (filters.minProgress !== undefined) {
      query = query.gte('projectprogress', filters.minProgress);
    }
    
    if (filters.maxProgress !== undefined) {
      query = query.lte('projectprogress', filters.maxProgress);
    }
    
    // Add pagination
    const { data, error, count } = await query
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order('projectregid', { ascending: false });
    
    if (error) throw error;
    
    return {
      data: data.map(transformProjectData),
      count: count || 15000 // Fallback to our known total count if exact count is not available
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}
