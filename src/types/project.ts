
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
  totalProjects: number;
  totalValue: number;
  totalArea: number;
  avgBookingPercentage: number;
  avgProgress: number;
  projectsByType: Record<string, number>;
  projectsByStatus: Record<string, number>;
  projectsByLocation: Record<string, number>;
  financialSummary: {
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
