
export interface ProjectLocation {
  latitude: number;
  longitude: number;
}

export interface ProjectData {
  id: string;
  name: string;
  promoter: string;
  type: string;
  status: string;
  progress: number;
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
  totalValue: number;
  totalSpend?: number;
  avgBookingPercentage: number;
  avgCollectionPercentage?: number;
  avgProgress: number;
  
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
  };
  
  // Sales & Booking Performance
  salesPerformance?: {
    totalUnits: number;
    bookedUnits: number;
    totalValue: number;
    receivedAmount: number;
    avgCollectionPercentage: number;
    revenuePerUnit: number;
  };
  
  // Project Velocity
  projectVelocity?: {
    avgProjectDuration: number; // in days
  };
  
  // Geographic Distribution
  projectsByLocation: Record<string, number>;
  avgBookingByLocation?: Record<string, number>;
  
  // Consultant & Promoter Insights
  topPromoters?: Record<string, number>;
  avgArchScore?: number;
  avgEngScore?: number;
  
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
