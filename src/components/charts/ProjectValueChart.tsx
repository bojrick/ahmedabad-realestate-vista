
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ProjectValueChartProps {
  totalValue: number;
  receivedAmount: number;
  labelA?: string;
  labelB?: string;
  isNumeric?: boolean;
}

const ProjectValueChart: React.FC<ProjectValueChartProps> = ({ 
  totalValue, 
  receivedAmount,
  labelA = "Total Value",
  labelB = "Received Amount",
  isNumeric = false
}) => {
  // Format values for display
  const formatValue = (value: number) => {
    if (isNumeric) {
      return value.toLocaleString();
    }
    
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} Lac`;
    } else {
      return `₹${value.toLocaleString()}`;
    }
  };

  // Calculate the remaining value
  const remainingValue = totalValue - receivedAmount;
  
  // Prevent negative values
  const safeRemainingValue = Math.max(0, remainingValue);
  const safeReceivedAmount = Math.max(0, receivedAmount);
  
  // Prepare chart data
  const chartData = [
    { name: labelB, value: safeReceivedAmount },
    { name: `Remaining ${labelA}`, value: safeRemainingValue }
  ];
  
  // Calculate percentage
  const percentage = totalValue > 0 ? (receivedAmount / totalValue) * 100 : 0;
  
  // Chart colors
  const COLORS = ['#3182ce', '#e2e8f0'];

  return (
    <div className="flex flex-col items-center w-full h-full">
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [formatValue(value as number), isNumeric ? "Count" : "Amount"]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          {labelB}: {formatValue(receivedAmount)} of {formatValue(totalValue)} ({percentage.toFixed(1)}%)
        </p>
      </div>
    </div>
  );
};

export default ProjectValueChart;
