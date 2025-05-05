
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useProjectData } from "@/hooks/useProjectData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileChart, BarChart, PieChart, Table, Download } from "lucide-react";

const Reports = () => {
  const { allProjects, loading } = useProjectData();
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("summary");
  const [chartType, setChartType] = useState("bar");

  const fieldGroups = [
    {
      name: "Basic Info",
      fields: [
        { id: "projectname", label: "Project Name", selected: true },
        { id: "promotername", label: "Promoter Name", selected: true },
        { id: "projecttype", label: "Project Type", selected: true },
        { id: "projectstatus", label: "Project Status", selected: true },
      ]
    },
    {
      name: "Location",
      fields: [
        { id: "projectaddress", label: "Project Address", selected: false },
        { id: "distname", label: "District", selected: true },
        { id: "pincode", label: "PIN Code", selected: false },
      ]
    },
    {
      name: "Financial",
      fields: [
        { id: "total_unit_consideration", label: "Total Value", selected: true },
        { id: "total_received_amount", label: "Received Amount", selected: true },
        { id: "payment_collection_percentage", label: "Collection %", selected: true },
        { id: "booking_percentage", label: "Booking %", selected: true },
      ]
    },
    {
      name: "Area Details",
      fields: [
        { id: "totareaofland", label: "Total Land Area", selected: false },
        { id: "total_carpet_area", label: "Total Carpet Area", selected: true },
        { id: "total_builtup_area", label: "Total Built-up Area", selected: false },
      ]
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-realestate-primary mb-2">
          Custom Reports
        </h1>
        <p className="text-muted-foreground">
          Build and export custom reports from RERA project data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileChart className="mr-2 h-5 w-5" />
                Report Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input 
                  id="report-name" 
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="My Custom Report" 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary Report</SelectItem>
                    <SelectItem value="detailed">Detailed Report</SelectItem>
                    <SelectItem value="financial">Financial Analysis</SelectItem>
                    <SelectItem value="location">Location-based Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Visualization Type</Label>
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="table">Table Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border rounded-md p-3 space-y-4 mt-4">
                <Label>Select Fields to Include</Label>
                
                {fieldGroups.map((group) => (
                  <div key={group.name} className="space-y-2">
                    <h4 className="text-sm font-medium">{group.name}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {group.fields.map((field) => (
                        <div key={field.id} className="flex items-center space-x-2">
                          <Checkbox id={field.id} defaultChecked={field.selected} />
                          <Label htmlFor={field.id} className="text-xs">{field.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full">
                <FileChart className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              
              <div className="flex justify-between">
                <Button variant="outline" size="sm">
                  Save Template
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-1 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                Report Preview
                {reportName && `: ${reportName}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="chart">
                <TabsList>
                  <TabsTrigger value="chart">
                    {chartType === "bar" && <BarChart className="mr-1 h-4 w-4" />}
                    {chartType === "pie" && <PieChart className="mr-1 h-4 w-4" />}
                    {chartType === "line" && <BarChart className="mr-1 h-4 w-4" />}
                    Chart
                  </TabsTrigger>
                  <TabsTrigger value="table">
                    <Table className="mr-1 h-4 w-4" />
                    Table
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chart" className="h-[600px] flex items-center justify-center border rounded-md mt-4">
                  {loading ? (
                    <p>Loading chart data...</p>
                  ) : (
                    <div className="text-center">
                      <p className="text-muted-foreground">
                        {reportName || "Custom Report"} will appear here
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Select fields and click Generate Report
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="table" className="h-[600px] flex items-center justify-center border rounded-md mt-4">
                  {loading ? (
                    <p>Loading table data...</p>
                  ) : (
                    <div className="text-center">
                      <p className="text-muted-foreground">
                        Data table will appear here
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Select fields and click Generate Report
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
