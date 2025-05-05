
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/utils/formatters";

interface ProjectValueChartProps {
  totalValue: number;
  receivedAmount: number;
}

const ProjectValueChart: React.FC<ProjectValueChartProps> = ({ totalValue, receivedAmount }) => {
  const remainingAmount = totalValue - receivedAmount;
  
  // Optimize data structure for the chart
  const chartData = [
    {
      name: "Project Value",
      Total: totalValue,
      Received: receivedAmount,
      Remaining: remainingAmount
    }
  ];

  // Custom tooltip formatter
  const tooltipFormatter = (value: number) => [formatCurrency(value), 'Amount'];
  
  // Custom label formatter for the Y-axis
  const axisLabelFormatter = (value: number) => formatCurrency(value, false);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={axisLabelFormatter} />
        <Tooltip formatter={tooltipFormatter} />
        <Legend />
        <Bar dataKey="Total" name="Total Value" fill="#1a365d" />
        <Bar dataKey="Received" name="Received Amount" fill="#38a169" />
        <Bar dataKey="Remaining" name="Remaining Amount" fill="#e67e22" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProjectValueChart;
