
import { useState, useEffect } from "react";
import { Property, PropertyStats, PropertyFilters } from "@/types/property";
import { useToast } from "@/hooks/use-toast";

// Mock data for initial development until Supabase is connected
const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Luxury Apartment in Satellite",
    description: "Beautiful 3BHK apartment with modern amenities",
    price: 9500000,
    area: 1800,
    bedrooms: 3,
    bathrooms: 2,
    address: "Palm Residence, Satellite Road",
    location: "Satellite",
    propertyType: "apartment",
    listingType: "sale",
    imageUrl: "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    amenities: ["Swimming Pool", "Gym", "Security", "Power Backup"],
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-15T10:30:00Z"
  },
  {
    id: "2",
    title: "Commercial Shop in CG Road",
    description: "Prime location commercial property for business",
    price: 15000000,
    area: 1200,
    bedrooms: 0,
    bathrooms: 1,
    address: "Stellar Complex, CG Road",
    location: "CG Road",
    propertyType: "commercial",
    listingType: "sale",
    imageUrl: "https://images.unsplash.com/photo-1577979749830-f1d742b96791?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    amenities: ["24/7 Access", "Security", "Power Backup", "Parking"],
    createdAt: "2023-06-20T14:15:00Z",
    updatedAt: "2023-06-20T14:15:00Z"
  },
  {
    id: "3",
    title: "3BHK Villa in Bopal",
    description: "Spacious villa with garden and modern interiors",
    price: 14500000,
    area: 2500,
    bedrooms: 3,
    bathrooms: 3,
    address: "Green Valley, Bopal",
    location: "Bopal",
    propertyType: "villa",
    listingType: "sale",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    amenities: ["Garden", "Parking", "Security", "Clubhouse"],
    createdAt: "2023-07-10T09:45:00Z",
    updatedAt: "2023-07-10T09:45:00Z"
  },
  {
    id: "4",
    title: "2BHK for Rent in Navrangpura",
    description: "Well-maintained apartment in prime location",
    price: 25000,
    area: 1200,
    bedrooms: 2,
    bathrooms: 2,
    address: "Sky Heights, Navrangpura",
    location: "Navrangpura",
    propertyType: "apartment",
    listingType: "rent",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    amenities: ["Lift", "Security", "Power Backup", "Parking"],
    createdAt: "2023-08-05T11:20:00Z",
    updatedAt: "2023-08-05T11:20:00Z"
  },
  {
    id: "5",
    title: "4BHK Bungalow in Thaltej",
    description: "Luxurious bungalow with swimming pool",
    price: 25000000,
    area: 3500,
    bedrooms: 4,
    bathrooms: 4,
    address: "Royal Residency, Thaltej",
    location: "Thaltej",
    propertyType: "bungalow",
    listingType: "sale",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    amenities: ["Swimming Pool", "Garden", "Security", "Gym"],
    createdAt: "2023-09-12T13:50:00Z",
    updatedAt: "2023-09-12T13:50:00Z"
  },
  {
    id: "6",
    title: "Premium Plot in SG Highway",
    description: "Prime location residential plot with all approvals",
    price: 30000000,
    area: 5000,
    bedrooms: 0,
    bathrooms: 0,
    address: "Near Karnavati Club, SG Highway",
    location: "SG Highway",
    propertyType: "plot",
    listingType: "sale",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    amenities: ["Corner Plot", "East Facing", "All Approvals"],
    createdAt: "2023-10-08T10:00:00Z",
    updatedAt: "2023-10-08T10:00:00Z"
  }
];

export const useSupabase = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PropertyStats | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      
      try {
        // When Supabase is connected, replace this with actual Supabase query
        // const { data, error } = await supabase.from('properties').select('*');
        
        // Using mock data for now
        const data = MOCK_PROPERTIES;
        
        if (data) {
          setProperties(data);
          setFilteredProperties(data);
          calculateStats(data);
        } else {
          setError("Failed to fetch properties");
          toast({
            title: "Error",
            description: "Failed to fetch properties",
            variant: "destructive"
          });
        }
      } catch (err) {
        setError("An error occurred while fetching data");
        console.error(err);
        toast({
          title: "Error",
          description: "An error occurred while fetching data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
  const calculateStats = (data: Property[]): void => {
    if (!data.length) return;
    
    const propertiesByType: Record<string, number> = {};
    const propertiesByListingType: Record<string, number> = {};
    const propertiesByLocation: Record<string, number> = {};
    
    let totalPrice = 0;
    let totalArea = 0;
    
    data.forEach(property => {
      // Count by property type
      propertiesByType[property.propertyType] = (propertiesByType[property.propertyType] || 0) + 1;
      
      // Count by listing type
      propertiesByListingType[property.listingType] = (propertiesByListingType[property.listingType] || 0) + 1;
      
      // Count by location
      propertiesByLocation[property.location] = (propertiesByLocation[property.location] || 0) + 1;
      
      // Sum price and area for averages
      totalPrice += property.price;
      totalArea += property.area;
    });
    
    setStats({
      totalProperties: data.length,
      avgPrice: Math.round(totalPrice / data.length),
      avgArea: Math.round(totalArea / data.length),
      propertiesByType: propertiesByType as Record<PropertyType, number>,
      propertiesByListingType: propertiesByListingType as Record<ListingType, number>,
      propertiesByLocation: propertiesByLocation
    });
  };
  
  const filterProperties = (filters: PropertyFilters): void => {
    let filtered = [...properties];
    
    // Apply filters
    if (filters.propertyType && filters.propertyType.length) {
      filtered = filtered.filter(p => filters.propertyType!.includes(p.propertyType));
    }
    
    if (filters.listingType && filters.listingType.length) {
      filtered = filtered.filter(p => filters.listingType!.includes(p.listingType));
    }
    
    if (filters.location && filters.location.length) {
      filtered = filtered.filter(p => filters.location!.includes(p.location));
    }
    
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    }
    
    if (filters.minArea) {
      filtered = filtered.filter(p => p.area >= filters.minArea!);
    }
    
    if (filters.maxArea) {
      filtered = filtered.filter(p => p.area <= filters.maxArea!);
    }
    
    if (filters.bedrooms && filters.bedrooms.length) {
      filtered = filtered.filter(p => filters.bedrooms!.includes(p.bedrooms));
    }
    
    setFilteredProperties(filtered);
    calculateStats(filtered);
  };
  
  const resetFilters = (): void => {
    setFilteredProperties(properties);
    calculateStats(properties);
  };
  
  return {
    properties: filteredProperties,
    loading,
    error,
    stats,
    filterProperties,
    resetFilters
  };
};
