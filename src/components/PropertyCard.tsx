
import React from "react";
import { Property } from "@/types/property";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: Property;
}

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lac`;
  } else {
    return `₹${amount.toLocaleString()}`;
  }
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { 
    title, 
    price, 
    area, 
    bedrooms, 
    bathrooms, 
    location, 
    propertyType, 
    listingType,
    imageUrl
  } = property;
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"} 
          alt={title}
          className="object-cover w-full h-full"
        />
        <Badge 
          className="absolute top-2 right-2" 
          variant={listingType === 'sale' ? 'default' : 'secondary'}
        >
          {listingType === 'sale' ? 'For Sale' : listingType === 'rent' ? 'For Rent' : 'PG'}
        </Badge>
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">{location}, Ahmedabad</p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg text-realestate-primary">
            {formatCurrency(price)}
            {listingType === 'rent' && <span className="text-sm font-normal">/month</span>}
          </p>
          <Badge variant="outline">{propertyType}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{area} sq.ft</span>
          {bedrooms > 0 && <span>{bedrooms} {bedrooms === 1 ? 'bed' : 'beds'}</span>}
          {bathrooms > 0 && <span>{bathrooms} {bathrooms === 1 ? 'bath' : 'baths'}</span>}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
