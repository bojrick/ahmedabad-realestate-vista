
import React, { useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearlyDataPoint {
  year: number;
  value: number;
}

interface FilterOption {
  value: string;
  label: string;
}

interface YearlyTimeSeriesChartProps {
  title: string;
  data: YearlyDataPoint[];
  valuePrefix?: string;
  valueSuffix?: string;
  valueFormatter?: (value: number) => string;
  filterOptions: {
    status: FilterOption[];
    type: FilterOption[];
    location: FilterOption[];
  };
  onFilterChange?: (filterType: string, value: string) => void;
}

const YearlyTimeSeriesChart: React.FC<YearlyTimeSeriesChartProps> = ({
  title,
  data,
  valuePrefix = "",
  valueSuffix = "",
  valueFormatter,
  filterOptions,
  onFilterChange
}) => {
  const [status, setStatus] = useState<string>('all');
  const [projectType, setProjectType] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');

  const handleStatusChange = (value: string) => {
    setStatus(value);
    if (onFilterChange) onFilterChange('status', value);
  };

  const handleTypeChange = (value: string) => {
    setProjectType(value);
    if (onFilterChange) onFilterChange('type', value);
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    if (onFilterChange) onFilterChange('location', value);
  };

  const formatValue = (value: number) => {
    if (valueFormatter) {
      return valueFormatter(value);
    }
    return `${valuePrefix}${value.toLocaleString()}${valueSuffix}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {filterOptions.status.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={projectType} onValueChange={handleTypeChange}>
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {filterOptions.type.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={location} onValueChange={handleLocationChange}>
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {filterOptions.location.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 50, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="year"
                tickFormatter={(value) => value.toString()}
              />
              <YAxis
                tickFormatter={(value) => formatValue(value)}
              />
              <Tooltip 
                formatter={(value: number) => [formatValue(value), title]}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name={title}
                stroke="#1a365d"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default YearlyTimeSeriesChart;
