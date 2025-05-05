
import React, { useState } from "react";
import { Property, PropertyFilters, PropertyType, ListingType } from "@/types/property";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface PropertyListProps {
  properties: Property[];
  loading: boolean;
  onFilterChange: (filters: PropertyFilters) => void;
  onResetFilters: () => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ 
  properties, 
  loading, 
  onFilterChange,
  onResetFilters
}) => {
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<PropertyFilters>({});
  
  const locationOptions = [...new Set(properties.map(p => p.location))];
  
  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleReset = () => {
    setFilters({});
    onResetFilters();
  };
  
  const renderFilters = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Property Type</label>
        <Select 
          onValueChange={(value) => handleFilterChange('propertyType', [value as PropertyType])}
          value={filters.propertyType?.[0] || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="bungalow">Bungalow</SelectItem>
            <SelectItem value="plot">Plot</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="penthouse">Penthouse</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm font-medium">Listing Type</label>
        <Select 
          onValueChange={(value) => handleFilterChange('listingType', [value as ListingType])}
          value={filters.listingType?.[0] || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Listings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Listings</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
            <SelectItem value="pg">PG</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-sm font-medium">Location</label>
        <Select 
          onValueChange={(value) => handleFilterChange('location', value ? [value] : [])}
          value={filters.location?.[0] || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Locations</SelectItem>
            {locationOptions.map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm font-medium">Min Price</label>
          <Input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice || ""}
            onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Max Price</label>
          <Input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice || ""}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full"
          />
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium">Bedrooms</label>
        <Select 
          onValueChange={(value) => handleFilterChange('bedrooms', value ? [Number(value)] : [])}
          value={filters.bedrooms?.[0]?.toString() || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={handleReset} variant="outline" className="w-full">Reset Filters</Button>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Properties</h2>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your property search
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                {renderFilters()}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              {properties.length} Properties
            </span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {!isMobile && (
          <div>
            <div className="border rounded-lg p-4 sticky top-20">
              <h3 className="font-medium text-lg mb-4">Filters</h3>
              {renderFilters()}
            </div>
          </div>
        )}
        
        <div className={`${isMobile ? 'col-span-1' : 'col-span-2'}`}>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p>No properties found matching your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
