
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartBar, ChartLineUp, ChartPie, Table, FileText, Download, BarChart3, LineChart
} from "lucide-react";

// Custom report templates data
const reportTemplates = [
  {
    id: 1,
    title: "Project Overview",
    description: "Complete summary report of all projects across regions",
    icon: ChartBar,
    popular: true
  },
  {
    id: 2,
    title: "Financial Performance",
    description: "Analysis of booking values and collection efficiency",
    icon: BarChart3,
    popular: false
  },
  {
    id: 3,
    title: "Progress Tracking",
    description: "Track completion progress against timelines",
    icon: LineChart,
    popular: true
  },
  {
    id: 4,
    title: "Project Comparison",
    description: "Compare similar projects across parameters",
    icon: Table,
    popular: false
  }
];

// Custom analysis types
const analysisTypes = [
  {
    id: 1,
    title: "Location Analysis",
    description: "Compare real estate trends across different locations",
    icon: ChartPie,
    newFeature: true
  },
  {
    id: 2,
    title: "Price Trends",
    description: "Historical and predicted pricing analysis",
    icon: ChartLineUp,
    newFeature: false
  }
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-realestate-primary mb-2">
          Custom Reports
        </h1>
        <p className="text-muted-foreground">
          Generate standardized and custom reports for your project analysis needs
        </p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTemplates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <template.icon className="h-8 w-8 text-realestate-primary opacity-80" />
                  {template.popular && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded">
                      Popular
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg">{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">Generate</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Custom Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysisTypes.map((analysis) => (
            <Card key={analysis.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <analysis.icon className="h-8 w-8 text-realestate-primary opacity-80" />
                  {analysis.newFeature && (
                    <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded">
                      New
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg">{analysis.title}</CardTitle>
                <CardDescription>{analysis.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full">Create Analysis</Button>
              </CardFooter>
            </Card>
          ))}
          
          <Card className="bg-gray-50 border-dashed">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <CardTitle className="text-lg">Custom Report</CardTitle>
              <CardDescription>Build a report from scratch with custom parameters</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full">Create Custom</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Report Name</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Generated</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 text-sm">Q2 Project Summary</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                      Standard
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">2 days ago</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Download</span>
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">Performance Analysis 2025</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">
                      Custom
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">1 week ago</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Download</span>
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
