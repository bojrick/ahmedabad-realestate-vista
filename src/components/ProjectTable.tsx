
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

type SortField = keyof ProjectData | 'financials.totalValue' | 'dates.submission';

const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
  const [sortField, setSortField] = React.useState<SortField>('dates.submission');
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
  
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
  
  // Format date for display
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString || "N/A";
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

  // Helper function to get nested property value
  const getNestedValue = (object: any, path: string) => {
    const keys = path.split('.');
    return keys.reduce((obj, key) => obj && obj[key] !== undefined ? obj[key] : null, object);
  };

  // Sort projects by rerasubmissiondate (dates.submission) by default
  const sortedProjects = [...projects].sort((a, b) => {
    if (!sortField) return 0;
    
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
    
    // Handle date comparison
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
              className="cursor-pointer"
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
              className="cursor-pointer"
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
                  <span className="text-xs">{project.units.bookingPercentage || 0}%</span>
                </div>
              </TableCell>
              <TableCell>{formatDate(project.dates.submission)}</TableCell>
              <TableCell>{formatDate(project.dates.lastSale)}</TableCell>
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
