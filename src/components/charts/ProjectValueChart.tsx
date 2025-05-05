
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ProjectValueChartProps {
  totalValue: number;
  receivedAmount: number;
}

// Helper function to format currency values
const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lac`;
  } else {
    return `₹${amount.toLocaleString()}`;
  }
};

const ProjectValueChart: React.FC<ProjectValueChartProps> = ({ totalValue, receivedAmount }) => {
  const remainingAmount = totalValue - receivedAmount;
  
  const chartData = [
    {
      name: "Project Value",
      Total: totalValue,
      Received: receivedAmount,
      Remaining: remainingAmount
    }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => formatCurrency(value)} />
        <Tooltip formatter={(value) => [formatCurrency(value as number), 'Amount']} />
        <Legend />
        <Bar dataKey="Total" name="Total Value" fill="#1a365d" />
        <Bar dataKey="Received" name="Received Amount" fill="#38a169" />
        <Bar dataKey="Remaining" name="Remaining Amount" fill="#e67e22" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProjectValueChart;
