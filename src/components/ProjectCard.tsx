
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectData } from "@/types/project";
import { MapPin, ChartBar } from "lucide-react";

interface ProjectCardProps {
  project: ProjectData;
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

// Function to determine badge color based on project status
const getStatusBadgeVariant = (status: string): "default" | "outline" | "secondary" | "destructive" => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes("complete") || statusLower.includes("finished")) return "default";
  if (statusLower.includes("ongoing") || statusLower.includes("progress")) return "secondary";
  if (statusLower.includes("delayed") || statusLower.includes("issue")) return "destructive";
  return "outline";
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg truncate" title={project.name}>
            {project.name}
          </CardTitle>
          <Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">{project.promoter}</div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} />
            <span>{project.location}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Total Units</p>
              <p className="font-medium">{project.units.total}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Area</p>
              <p className="font-medium">{project.area.total.toLocaleString()} sq.m</p>
            </div>
            <div>
              <p className="text-muted-foreground">Booking</p>
              <p className="font-medium">{project.units.bookingPercentage.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Progress</p>
              <p className="font-medium">{project.progress.toFixed(1)}%</p>
            </div>
          </div>
          
          <div className="relative pt-1">
            <div className="text-xs text-muted-foreground mb-1">Project Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 border-t">
        <div className="flex justify-between items-center w-full">
          <div>
            <p className="text-xs text-muted-foreground">Project Value</p>
            <p className="font-medium">{formatCurrency(project.financials.totalValue)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Type</p>
            <p className="font-medium">{project.type}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
