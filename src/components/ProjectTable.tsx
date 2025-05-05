
import React from "react";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ProjectData } from "@/types/project";
import { ChevronRight, ArrowDown, ArrowUp } from "lucide-react";

interface ProjectTableProps {
  projects: ProjectData[];
}

type SortField = keyof ProjectData | 'financials.totalValue' | 'area.total';

const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
  const [sortField, setSortField] = React.useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");
  
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
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Basic sorting functionality
  const sortedProjects = [...projects].sort((a, b) => {
    if (!sortField) return 0;
    
    let fieldA: any;
    let fieldB: any;
    
    // Handle nested properties
    if (sortField === "financials.totalValue") {
      fieldA = a.financials.totalValue;
      fieldB = b.financials.totalValue;
    } else if (sortField === "area.total") {
      fieldA = a.area.total;
      fieldB = b.area.total;
    } else {
      fieldA = a[sortField as keyof ProjectData];
      fieldB = b[sortField as keyof ProjectData];
    }
    
    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer" 
              onClick={() => handleSort("name")}
            >
              Project Name
              {sortField === "name" && (
                sortDirection === "asc" ? 
                <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                <ArrowDown className="ml-1 h-4 w-4 inline" />
              )}
            </TableHead>
            <TableHead>Promoter</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("progress")}
            >
              Progress
              {sortField === "progress" && (
                sortDirection === "asc" ? 
                <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                <ArrowDown className="ml-1 h-4 w-4 inline" />
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer text-right"
              onClick={() => handleSort("financials.totalValue")}
            >
              Value
              {sortField === "financials.totalValue" && (
                sortDirection === "asc" ? 
                <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                <ArrowDown className="ml-1 h-4 w-4 inline" />
              )}
            </TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">
                <Link to={`/projects/${project.id}`} className="hover:text-blue-600 hover:underline">
                  {project.name}
                </Link>
              </TableCell>
              <TableCell>{project.promoter}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {project.type}
                </span>
              </TableCell>
              <TableCell>{project.location}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-full max-w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{project.progress}%</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(project.financials.totalValue)}
              </TableCell>
              <TableCell className="text-right">
                <Button asChild size="sm" variant="ghost">
                  <Link to={`/projects/${project.id}`}>
                    Details <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectTable;
