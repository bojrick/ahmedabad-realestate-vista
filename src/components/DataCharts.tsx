
import React from "react";
import { PropertyStats } from "@/types/property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface DataChartsProps {
  stats: PropertyStats | null;
}

// Custom colors for charts
const CHART_COLORS = [
  "#1a365d", // Deep blue (primary)
  "#e67e22", // Orange (secondary)
  "#3182ce", // Blue
  "#38a169", // Green
  "#d69e2e", // Yellow
  "#e53e3e", // Red
  "#805ad5", // Purple
  "#dd6b20", // Dark Orange
];

const DataCharts: React.FC<DataChartsProps> = ({ stats }) => {
  if (!stats) {
    return <div>Loading stats...</div>;
  }

  // Prepare data for property type chart
  const propertyTypeData = Object.entries(stats.propertiesByType).map(([type, count], index) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count,
    color: CHART_COLORS[index % CHART_COLORS.length]
  }));

  // Prepare data for listing type chart
  const listingTypeData = Object.entries(stats.propertiesByListingType).map(([type, count], index) => ({
    name: type === 'sale' ? 'For Sale' : type === 'rent' ? 'For Rent' : 'PG',
    value: count,
    color: CHART_COLORS[(index + 3) % CHART_COLORS.length]
  }));

  // Prepare data for location chart
  const locationData = Object.entries(stats.propertiesByLocation)
    .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
    .slice(0, 6) // Take top 6 locations only
    .map(([location, count], index) => ({
      name: location,
      value: count,
      color: CHART_COLORS[(index + 1) % CHART_COLORS.length]
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Properties by Type</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={propertyTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {propertyTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} properties`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Properties by Listing Type</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={listingTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {listingTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} properties`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Properties by Location</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={locationData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} properties`, 'Count']} />
              <Legend />
              <Bar dataKey="value" name="Properties" fill="#1a365d" radius={[4, 4, 0, 0]}>
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataCharts;
