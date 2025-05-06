
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
import { ChevronRight, ArrowDown, ArrowUp, Calendar } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface ProjectTableProps {
  projects: ProjectData[];
}

// Define the types for sortable fields
type SortField = 
  | "name" 
  | "promoter" 
  | "type" 
  | "location" 
  | "units.bookingPercentage"
  | "dates.submission"
  | "dates.lastSale"
  | "financials.totalValue";

const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
  const [sortField, setSortField] = React.useState<SortField>("dates.submission");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Helper function to get nested property value
  const getNestedValue = (object: any, path: string) => {
    const keys = path.split('.');
    return keys.reduce((obj, key) => obj && obj[key] !== undefined ? obj[key] : null, object);
  };

  // Sort projects
  const sortedProjects = [...projects].sort((a, b) => {
    let fieldA: any;
    let fieldB: any;
    
    // Handle nested properties
    if (sortField.includes('.')) {
      fieldA = getNestedValue(a, sortField);
      fieldB = getNestedValue(b, sortField);
    } else {
      fieldA = a[sortField as keyof ProjectData];
      fieldB = b[sortField as keyof ProjectData];
    }
    
    // Handle null or undefined values
    if (fieldA === null || fieldA === undefined) return sortDirection === "asc" ? -1 : 1;
    if (fieldB === null || fieldB === undefined) return sortDirection === "asc" ? 1 : -1;
    
    // Handle date comparison for submission and lastSale dates
    if (sortField === 'dates.submission' || sortField === 'dates.lastSale') {
      const dateA = fieldA ? new Date(fieldA).getTime() : 0;
      const dateB = fieldB ? new Date(fieldB).getTime() : 0;
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    
    // Default comparison
    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
  
  return (
    <div className="rounded-md border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer whitespace-nowrap" 
              onClick={() => handleSort("name")}
            >
              Project Name
              {sortField === "name" && (
                sortDirection === "asc" ? 
                <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                <ArrowDown className="ml-1 h-4 w-4 inline" />
              )}
            </TableHead>
            <TableHead className="whitespace-nowrap">Promoter</TableHead>
            <TableHead className="whitespace-nowrap">Type</TableHead>
            <TableHead className="whitespace-nowrap">Location</TableHead>
            <TableHead
              className="cursor-pointer whitespace-nowrap"
              onClick={() => handleSort("units.bookingPercentage")}
            >
              Booking %
              {sortField === "units.bookingPercentage" && (
                sortDirection === "asc" ? 
                <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                <ArrowDown className="ml-1 h-4 w-4 inline" />
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer whitespace-nowrap"
              onClick={() => handleSort("dates.submission")}
            >
              Submission Date
              {sortField === "dates.submission" && (
                sortDirection === "asc" ? 
                <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                <ArrowDown className="ml-1 h-4 w-4 inline" />
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer whitespace-nowrap"
              onClick={() => handleSort("dates.lastSale")}
            >
              Last Sale Date
              {sortField === "dates.lastSale" && (
                sortDirection === "asc" ? 
                <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                <ArrowDown className="ml-1 h-4 w-4 inline" />
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer text-right whitespace-nowrap"
              onClick={() => handleSort("financials.totalValue")}
            >
              Value
              {sortField === "financials.totalValue" && (
                sortDirection === "asc" ? 
                <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
                <ArrowDown className="ml-1 h-4 w-4 inline" />
              )}
            </TableHead>
            <TableHead className="text-right whitespace-nowrap">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium max-w-[200px] truncate">
                <Link to={`/projects/${project.id}`} className="hover:text-blue-600 hover:underline">
                  {project.name}
                </Link>
              </TableCell>
              <TableCell className="max-w-[150px] truncate">{project.promoter}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 whitespace-nowrap">
                  {project.type}
                </span>
              </TableCell>
              <TableCell className="max-w-[120px] truncate">{project.location}</TableCell>
              <TableCell>
                <span className="text-xs whitespace-nowrap">{project.units.bookingPercentage || 0}%</span>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(project.dates.submission)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(project.dates.lastSale)}
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
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
