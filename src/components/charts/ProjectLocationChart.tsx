
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

interface ProjectLocationChartProps {
  data: Record<string, number>;
}

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

const ProjectLocationChart: React.FC<ProjectLocationChartProps> = ({ data }) => {
  // Sort locations by project count and take top 10
  const chartData = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value], index) => ({
      name,
      value,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={60}
          interval={0}
        />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} projects`, 'Count']} />
        <Legend />
        <Bar dataKey="value" name="Projects" fill="#1a365d" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProjectLocationChart;
