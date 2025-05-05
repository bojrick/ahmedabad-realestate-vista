
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  area: number; // in sq ft
  bedrooms: number;
  bathrooms: number;
  address: string;
  location: string; // Area in Ahmedabad
  propertyType: PropertyType;
  listingType: ListingType;
  imageUrl?: string;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export type PropertyType = 
  | 'apartment'
  | 'villa'
  | 'bungalow'
  | 'plot'
  | 'commercial'
  | 'penthouse';

export type ListingType = 
  | 'sale'
  | 'rent'
  | 'pg';

export interface PropertyStats {
  totalProperties: number;
  avgPrice: number;
  avgArea: number;
  propertiesByType: Record<PropertyType, number>;
  propertiesByListingType: Record<ListingType, number>;
  propertiesByLocation: Record<string, number>;
}

export interface PropertyFilters {
  propertyType?: PropertyType[];
  listingType?: ListingType[];
  location?: string[];
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number[];
}
