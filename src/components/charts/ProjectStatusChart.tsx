
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ProjectStatusChartProps {
  data: Record<string, number>;
}

const CHART_COLORS = [
  "#38a169", // Green (for completed)
  "#3182ce", // Blue (for ongoing)
  "#d69e2e", // Yellow (for planning)
  "#e53e3e", // Red (for delayed)
  "#805ad5", // Purple
  "#1a365d", // Deep blue
];

const ProjectStatusChart: React.FC<ProjectStatusChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([name, value], index) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: CHART_COLORS[index % CHART_COLORS.length]
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} projects`, 'Count']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ProjectStatusChart;
