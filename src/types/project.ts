
export interface ProjectLocation {
  latitude: number;
  longitude: number;
}

export interface ProjectData {
  id: string;
  name: string;
  promoter: string;
  promoterType?: string;
  type: string;
  status: string;
  progress: number;
  description?: string;
  address: string;
  location: string;
  coordinates: ProjectLocation | null;
  area: {
    total: number;
    carpet: number;
    built: number;
    balcony: number;
  };
  units: {
    total: number;
    booked: number;
    residential: number;
    commercial: number;
    bookingPercentage: number;
  };
  financials: {
    totalValue: number;
    receivedAmount: number;
    collectionPercentage: number;
    constructionCost: number;
    landCost: number;
  };
  dates: {
    start: Date | null;
    completion: Date | null;
    lastUpdated: Date | null;
  };
}

export interface ProjectSummary {
  // Market Overview
  totalProjects: number;
  activeProjects?: number;
  completedProjects?: number; 
  delayedProjects?: number;
  unreportedProjects?: number;
  totalValue: number;
  totalSpend?: number;
  avgBookingPercentage: number;
  avgCollectionPercentage?: number;
  avgProgress: number;
  
  // Year over Year Changes
  yoyChanges?: {
    totalProjects?: number; // percentage change
    activeProjects?: number; // percentage change
    completedProjects?: number; // percentage change
    totalValue?: number; // percentage change
    avgBookingPercentage?: number; // percentage point change
    avgProgress?: number; // percentage point change
  };
  
  // Project Pipeline
  projectsByStatus: Record<string, number>;
  projectsByType: Record<string, number>;
  projectsByPromoterType?: Record<string, number>;
  
  // Financial Health
  financials?: {
    landCost: number;
    developmentCost: number;
    taxesAndPremiums: number;
    interestCharges: number;
    netCashFlow: number;
    avgCostVariance: number; // percentage
    yoyLandCost?: number; // percentage change
    yoyDevelopmentCost?: number; // percentage change
    yoyCostVariance?: number; // percentage point change
  };
  
  // Sales & Booking Performance
  salesPerformance?: {
    totalUnits: number;
    bookedUnits: number;
    totalValue: number;
    receivedAmount: number;
    avgCollectionPercentage: number;
    revenuePerUnit: number;
    yoyBookedUnits?: number; // percentage change
    yoyReceivedAmount?: number; // percentage change
    yoyCollectionPercentage?: number; // percentage point change
  };
  
  // Project Velocity
  projectVelocity?: {
    avgProjectDuration: number; // in days
    yoyAvgProjectDuration?: number; // percentage change in duration
    completedOnTime?: number; // count
    completedDelayed?: number; // count
    upcomingCompletions?: ProjectData[]; // projects completing in next 6 months
  };
  
  // Geographic Distribution
  projectsByLocation: Record<string, number>;
  avgBookingByLocation?: Record<string, number>;
  yoyProjectsByLocation?: Record<string, number>; // percentage change by location
  
  // Consultant & Promoter Insights
  topPromoters?: Record<string, number>;
  avgArchScore?: number;
  avgEngScore?: number;
  yoyAvgArchScore?: number; // percentage point change
  yoyAvgEngScore?: number; // percentage point change
  
  // Legacy fields for backward compatibility
  totalArea?: number;
  financialSummary?: {
    totalValue: number;
    receivedAmount: number;
    avgCollectionPercentage: number;
  };
}

export interface ProjectFilters {
  type?: string[];
  status?: string[];
  location?: string[];
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  minProgress?: number;
  maxProgress?: number;
}

// Helper function to determine project status based on projectprogress field
export function getProjectStatusFromProgress(progressText: string | null): 'active' | 'completed' | 'delayed' | 'unreported' {
  if (!progressText) return 'unreported';
  
  const normalized = progressText.toLowerCase().trim();
  
  // Completed projects
  if (normalized.includes('complete') && normalized.includes('q-e')) {
    return 'completed';
  }
  
  // Delayed projects
  if (
    normalized.includes('slow') || 
    normalized.includes('incomplete') || 
    normalized.includes('time overrun') ||
    normalized.includes('ill')
  ) {
    return 'delayed';
  }
  
  // Unreported projects
  if (
    normalized.includes('unreported') || 
    normalized === 'null' ||
    normalized === ''
  ) {
    return 'unreported';
  }
  
  // Active projects (on track)
  if (normalized.includes('on track')) {
    return 'active';
  }
  
  // Default to unreported if we can't determine
  return 'unreported';
}
