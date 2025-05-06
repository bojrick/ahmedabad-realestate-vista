
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectDetailQuery } from "@/hooks/useProjectsQuery";
import { PieChart, BarChart, FileText, ArrowLeft, Building, MapPin, Calendar, Loader } from "lucide-react";
import ProjectValueChart from "@/components/charts/ProjectValueChart";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, isError, error } = useProjectDetailQuery(id || '');
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground mr-2" />
        <p>Loading project details...</p>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Project</h2>
        <p className="text-muted-foreground mb-4">{(error as Error)?.message || "An unknown error occurred"}</p>
        <Button asChild variant="outline">
          <Link to="/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-2">Project Not Found</h2>
        <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist or has been removed.</p>
        <Button asChild variant="outline">
          <Link to="/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }
  
  // Format date if available
  const formatDate = (date: Date | null) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format currency values
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lac`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/projects">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-realestate-primary mb-1">
              {project.name}
            </h1>
            <p className="text-muted-foreground flex items-center">
              <Building className="h-4 w-4 mr-1" />
              {project.promoter} | 
              <MapPin className="h-4 w-4 mx-1" />
              {project.location}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded">
              {project.type}
            </span>
            <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded">
              {project.status}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground text-xs mb-1">Project Value</div>
            <div className="text-xl font-bold">
              {formatCurrency(project.financials.totalValue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground text-xs mb-1">Total Area</div>
            <div className="text-xl font-bold">
              {project.area.carpet.toLocaleString()} sq.m
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground text-xs mb-1">Units</div>
            <div className="text-xl font-bold">
              {project.units.total} ({project.units.booked} booked)
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground text-xs mb-1">Progress</div>
            <div className="flex items-end gap-1">
              <div className="text-xl font-bold">{project.progress}%</div>
              <div className="text-xs text-muted-foreground mb-1">complete</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Timeline</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <div className="flex flex-col md:flex-row justify-between py-4">
              <div className="mb-4 md:mb-0">
                <div className="text-sm text-muted-foreground">Start Date</div>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="font-medium">{formatDate(project.dates.start)}</span>
                </div>
              </div>
              
              <div className="relative w-full max-w-md mx-4 hidden md:block">
                <div className="absolute top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2"></div>
                <div 
                  className="absolute top-1/2 h-1 bg-blue-500 -translate-y-1/2" 
                  style={{ width: `${project.progress}%` }}
                ></div>
                <div 
                  className="absolute top-0 -translate-y-1/2"
                  style={{ left: `${project.progress}%` }}
                >
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-xs font-medium">{project.progress}% Complete</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Expected Completion</div>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="font-medium">{formatDate(project.dates.completion)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial Data</TabsTrigger>
          <TabsTrigger value="units">Units & Area</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Project Type</dt>
                    <dd className="text-sm font-medium">{project.type}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Status</dt>
                    <dd className="text-sm font-medium">{project.status}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Address</dt>
                    <dd className="text-sm font-medium">{project.address || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">District</dt>
                    <dd className="text-sm font-medium">{project.location}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Promoter</dt>
                    <dd className="text-sm font-medium">{project.promoter}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Promoter Type</dt>
                    <dd className="text-sm font-medium">{project.promoterType || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Project Description</dt>
                    <dd className="text-sm font-medium">{project.description || 'Not specified'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Booked Units</span>
                    <span className="text-sm font-medium">{project.units.bookingPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${project.units.bookingPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{project.units.booked} units</span>
                    <span>of {project.units.total} total</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Construction Progress</span>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Payment Collection</span>
                    <span className="text-sm font-medium">{project.financials.collectionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${project.financials.collectionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{formatCurrency(project.financials.receivedAmount)}</span>
                    <span>of {formatCurrency(project.financials.totalValue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="financial" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <dl className="space-y-4">
                    <div className="grid grid-cols-2">
                      <dt className="text-sm text-muted-foreground">Total Value</dt>
                      <dd className="text-sm font-medium">
                        {formatCurrency(project.financials.totalValue)}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2">
                      <dt className="text-sm text-muted-foreground">Received Amount</dt>
                      <dd className="text-sm font-medium">
                        {formatCurrency(project.financials.receivedAmount)}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2">
                      <dt className="text-sm text-muted-foreground">Collection %</dt>
                      <dd className="text-sm font-medium">{project.financials.collectionPercentage}%</dd>
                    </div>
                    <div className="grid grid-cols-2">
                      <dt className="text-sm text-muted-foreground">Construction Cost</dt>
                      <dd className="text-sm font-medium">
                        {formatCurrency(project.financials.constructionCost)}
                      </dd>
                    </div>
                    <div className="grid grid-cols-2">
                      <dt className="text-sm text-muted-foreground">Land Cost</dt>
                      <dd className="text-sm font-medium">
                        {formatCurrency(project.financials.landCost)}
                      </dd>
                    </div>
                  </dl>
                  
                  <div className="h-[300px]">
                    <ProjectValueChart 
                      totalValue={project.financials.totalValue} 
                      receivedAmount={project.financials.receivedAmount} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="units" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Units Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Total Units</dt>
                    <dd className="text-sm font-medium">{project.units.total}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Booked Units</dt>
                    <dd className="text-sm font-medium">{project.units.booked} ({project.units.bookingPercentage}%)</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Residential Units</dt>
                    <dd className="text-sm font-medium">{project.units.residential}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Commercial Units</dt>
                    <dd className="text-sm font-medium">{project.units.commercial}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Area Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Total Land Area</dt>
                    <dd className="text-sm font-medium">{project.area.total.toLocaleString()} sq.m</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Total Carpet Area</dt>
                    <dd className="text-sm font-medium">{project.area.carpet.toLocaleString()} sq.m</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Total Built-up Area</dt>
                    <dd className="text-sm font-medium">{project.area.built.toLocaleString()} sq.m</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Total Balcony Area</dt>
                    <dd className="text-sm font-medium">{project.area.balcony.toLocaleString()} sq.m</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Document management coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
