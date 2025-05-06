
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
    submission: string | null;
    lastSale: string | null;
  };
  promoterType?: string;
  description?: string;
}

export interface ProjectSummary {
  totalProjects: number;
  totalValue: number;
  totalArea: number;
  avgBookingPercentage: number;
  avgProgress: number;
  projectsByType: Record<string, number>;
  projectsByStatus: Record<string, number>;
  projectsByLocation: Record<string, number>;
  projectsByPromoterType?: Record<string, number>;
  topPromoters?: Record<string, number>;
  financialSummary: {
    totalValue: number;
    receivedAmount: number;
    avgCollectionPercentage: number;
  };
  // Dashboard components specific properties
  activeProjects?: number;
  completedProjects?: number;
  delayedProjects?: number;
  unreportedProjects?: number;
  totalSpend?: number;
  avgCollectionPercentage?: number;
  yoyChanges?: {
    totalProjects?: number;
    activeProjects?: number;
    completedProjects?: number;
    totalValue?: number;
    avgBookingPercentage?: number;
    avgProgress?: number;
  };
  financials?: {
    landCost: number;
    developmentCost: number;
    taxesAndPremiums: number;
    interestCharges: number;
    netCashFlow: number;
    avgCostVariance: number;
    yoyLandCost: number;
    yoyDevelopmentCost: number;
    yoyCostVariance: number;
  };
  salesPerformance?: {
    totalUnits: number;
    bookedUnits: number;
    totalValue: number;
    receivedAmount: number;
    avgCollectionPercentage: number;
    revenuePerUnit: number;
    yoyBookedUnits: number;
    yoyReceivedAmount: number;
    yoyCollectionPercentage: number;
  };
  projectVelocity?: {
    avgProjectDuration: number;
    yoyAvgProjectDuration: number;
    completedOnTime: number;
    completedDelayed: number;
  };
  avgArchScore?: number;
  avgEngScore?: number;
  yoyAvgArchScore?: number;
  yoyAvgEngScore?: number;
}

export interface ProjectFilters {
  type?: string[];
  status?: string[];
  location?: string[];
  minProgress?: number;
  maxProgress?: number;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
}

export type ProjectStatus = 'active' | 'completed' | 'delayed' | 'unreported';

export const getProjectStatusFromProgress = (status: string): ProjectStatus => {
  status = status.toLowerCase();
  if (status === 'completed') {
    return 'completed';
  } else if (status === 'delayed') {
    return 'delayed';
  } else if (status === 'ongoing') {
    return 'active';
  } else {
    return 'unreported';
  }
};
