
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectDetailQuery } from "@/hooks/useProjectDetail";
import { PieChart, BarChart, FileText, ArrowLeft, Building, MapPin, Calendar, Loader } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const formatDate = (date: Date | string | null) => {
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
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="units">Units & Area</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
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
                    <dt className="text-sm text-muted-foreground">Project ID</dt>
                    <dd className="text-sm font-medium">{project.id}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Project Name</dt>
                    <dd className="text-sm font-medium">{project.name}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Project Type</dt>
                    <dd className="text-sm font-medium">{project.type}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Status</dt>
                    <dd className="text-sm font-medium">{project.status}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Progress</dt>
                    <dd className="text-sm font-medium">{project.progress}%</dd>
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
                    <dt className="text-sm text-muted-foreground">Pincode</dt>
                    <dd className="text-sm font-medium">{project.pincode || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Moje</dt>
                    <dd className="text-sm font-medium">{project.moje || 'Not specified'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Developer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Promoter</dt>
                    <dd className="text-sm font-medium">{project.promoter}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Promoter Type</dt>
                    <dd className="text-sm font-medium">{project.promoterType || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Architect</dt>
                    <dd className="text-sm font-medium">{project.architectName || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Architect Address</dt>
                    <dd className="text-sm font-medium">{project.architectAddress || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Engineer</dt>
                    <dd className="text-sm font-medium">{project.engineerName || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Engineer Address</dt>
                    <dd className="text-sm font-medium">{project.engineerAddress || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">TP Number</dt>
                    <dd className="text-sm font-medium">{project.tpNumber || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">TP Name</dt>
                    <dd className="text-sm font-medium">{project.tpName || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Place</dt>
                    <dd className="text-sm font-medium">{project.place || 'Not specified'}</dd>
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
                
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Area Booking</span>
                    <span className="text-sm font-medium">{project.areaBookingPercentage || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${project.areaBookingPercentage || 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Dates</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Start Date</dt>
                    <dd className="text-sm font-medium">{formatDate(project.dates.start)}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Completion Date</dt>
                    <dd className="text-sm font-medium">{formatDate(project.dates.completion)}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Last Updated</dt>
                    <dd className="text-sm font-medium">{formatDate(project.dates.lastUpdated)}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Submission Date</dt>
                    <dd className="text-sm font-medium">{formatDate(project.dates.submission)}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Last Sale</dt>
                    <dd className="text-sm font-medium">{formatDate(project.dates.lastSale)}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Project Approved Date</dt>
                    <dd className="text-sm font-medium">{formatDate(project.projectApprovedDate)}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">RERA Submission Date</dt>
                    <dd className="text-sm font-medium">{formatDate(project.reraSubmissionDate)}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Time Lapse</dt>
                    <dd className="text-sm font-medium">{project.timeLapse || 'Not specified'}</dd>
                  </div>
                </dl>
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
                  <div>
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
                  </div>
                  
                  <div className="h-[300px]">
                    <ProjectValueChart 
                      totalValue={project.financials.totalValue} 
                      receivedAmount={project.financials.receivedAmount} 
                    />
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Land & Development Costs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-3">
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Acquisition Cost of Land (A)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.acquisitionCostOfLandA || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Acquisition Cost of Land (B)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.acquisitionCostOfLandB || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Premium Payable (A)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.premiumPayableA || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Premium Payable (B)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.premiumPayableB || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">TDR Acquisition Cost (A)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.tdrAcquisitionCostA || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">TDR Acquisition Cost (B)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.tdrAcquisitionCostB || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Land Premium (A)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.landPremiumA || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Land Premium (B)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.landPremiumB || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Subtotal of Land Cost (A)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.subtotalOfLandCostA || 0)}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Development & Construction Costs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-3">
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Est. Construction Cost (A)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.estConstructionCostA || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Actual Construction Cost (B)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.actualConstructionCostB || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Onsite Development (A)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.onsiteDevelopmentA || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Onsite Development (B)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.onsiteDevelopmentB || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Tax Payments (A)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.taxPaymentsA || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Tax Payments (B)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.taxPaymentsB || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Finance Interest (A)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.financeInterestA || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Finance Interest (B)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.financeInterestB || 0)}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Cost Totals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-3">
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Subtotal Development Cost (A)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.subtotalDevelopmentCostA || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Subtotal Development Cost (B)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.subtotalDevelopmentCostB || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Total Estimated Project Cost</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.totalEstimatedProjectCost || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Total Cost Incurred & Paid</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.totalCostIncurredAndPaid || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Est. Balance Cost to Complete</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.estimatedBalanceCostToComplete || 0)}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Government Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-3">
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">State Govt. Amount (A)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.stateGovtAmountA || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">State Govt. Amount (B)</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.stateGovtAmountB || 0)}</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>
                
                <Separator className="my-6" />
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Designated Account Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <dl className="space-y-3">
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Amount Withdrawn from Designated Account</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.amountWithdrawnFromDesignatedAccount || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Amount Withdrawn to Date</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.amountWithdrawnToDate || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Net Amount Withdrawn</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.netAmountWithdrawnFromDesignatedAccount || 0)}</dd>
                        </div>
                      </dl>
                      
                      <dl className="space-y-3">
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Balance Unbooked Area Certificate</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.balanceUnbookedAreaCertificate || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Balance Receivables from Booked Units</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.balanceReceivablesFromBookedUnits || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Estimated Sales from Unbooked Units</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.estimatedSalesProceedsForUnbookedUnits || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Estimated Receivables</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.estimatedReceivablesOngoingProject || 0)}</dd>
                        </div>
                        <div className="grid grid-cols-2">
                          <dt className="text-xs text-muted-foreground">Amount to be Deposited</dt>
                          <dd className="text-sm font-medium">{formatCurrency(project.amountToBeDepositedInDesignatedAccount || 0)}</dd>
                        </div>
                      </dl>
                    </div>
                  </CardContent>
                </Card>
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
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Office Units</dt>
                    <dd className="text-sm font-medium">{project.officeUnits || 0}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Shop Units</dt>
                    <dd className="text-sm font-medium">{project.shopUnits || 0}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Other Units</dt>
                    <dd className="text-sm font-medium">{project.otherUnits || 0}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Plot Units</dt>
                    <dd className="text-sm font-medium">{project.plotUnits || 0}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Flat Units</dt>
                    <dd className="text-sm font-medium">{project.flatUnits || 0}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Inventory Count</dt>
                    <dd className="text-sm font-medium">{project.inventoryCount || 0}</dd>
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
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Project Land Area</dt>
                    <dd className="text-sm font-medium">{(project.projectTotalLandArea || 0).toLocaleString()} sq.m</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Project Carpet Area</dt>
                    <dd className="text-sm font-medium">{(project.projectTotalCarpetArea || 0).toLocaleString()} sq.m</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Total Covered Area</dt>
                    <dd className="text-sm font-medium">{(project.totalCoveredArea || 0).toLocaleString()} sq.m</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Total Open Area</dt>
                    <dd className="text-sm font-medium">{(project.totalOpenArea || 0).toLocaleString()} sq.m</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Residential Unit Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Residential Carpet Area</dt>
                    <dd className="text-sm font-medium">{(project.residentialCarpetArea || 0).toLocaleString()} sq.m</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Residential Balcony Area</dt>
                    <dd className="text-sm font-medium">{(project.residentialBalconyArea || 0).toLocaleString()} sq.m</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Residential Unit Value</dt>
                    <dd className="text-sm font-medium">{formatCurrency(project.residentialUnitConsideration || 0)}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Residential Amount Received</dt>
                    <dd className="text-sm font-medium">{formatCurrency(project.residentialReceivedAmount || 0)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Commercial Unit Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Office Carpet Area</dt>
                    <dd className="text-sm font-medium">{(project.officeCarpetArea || 0).toLocaleString()} sq.m</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Office Balcony Area</dt>
                    <dd className="text-sm font-medium">{(project.officeBalconyArea || 0).toLocaleString()} sq.m</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Office Unit Value</dt>
                    <dd className="text-sm font-medium">{formatCurrency(project.officeUnitConsideration || 0)}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Office Amount Received</dt>
                    <dd className="text-sm font-medium">{formatCurrency(project.officeReceivedAmount || 0)}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Shop Carpet Area</dt>
                    <dd className="text-sm font-medium">{(project.shopCarpetArea || 0).toLocaleString()} sq.m</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Shop Balcony Area</dt>
                    <dd className="text-sm font-medium">{(project.shopBalconyArea || 0).toLocaleString()} sq.m</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Shop Unit Value</dt>
                    <dd className="text-sm font-medium">{formatCurrency(project.shopUnitConsideration || 0)}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Shop Amount Received</dt>
                    <dd className="text-sm font-medium">{formatCurrency(project.shopReceivedAmount || 0)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Parking Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Open Parking Area</dt>
                    <dd className="text-sm font-medium">{(project.openParkingArea || 0).toLocaleString()} sq.m</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Covered Parking Area</dt>
                    <dd className="text-sm font-medium">{(project.coveredParkingArea || 0).toLocaleString()} sq.m</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Covered Parking Count</dt>
                    <dd className="text-sm font-medium">{project.coveredParking || 0}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Parking For Sale Count</dt>
                    <dd className="text-sm font-medium">{project.parkingForSaleCount || 0}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Parking For Sale Area</dt>
                    <dd className="text-sm font-medium">{(project.parkingForSaleArea || 0).toLocaleString()} sq.m</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Garage For Sale Count</dt>
                    <dd className="text-sm font-medium">{project.garageForSaleCount || 0}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Garage For Sale Area</dt>
                    <dd className="text-sm font-medium">{(project.garageForSaleArea || 0).toLocaleString()} sq.m</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Booked Carpet Area</dt>
                    <dd className="text-sm font-medium">{(project.bookedCarpetArea || 0).toLocaleString()} sq.m</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Booked Balcony Area</dt>
                    <dd className="text-sm font-medium">{(project.bookedBalconyArea || 0).toLocaleString()} sq.m</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Booked Unit Value</dt>
                    <dd className="text-sm font-medium">{formatCurrency(project.bookedUnitConsideration || 0)}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Booked Received Amount</dt>
                    <dd className="text-sm font-medium">{formatCurrency(project.bookedReceivedAmount || 0)}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Booking Percentage</dt>
                    <dd className="text-sm font-medium">{project.units.bookingPercentage}%</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Area Booking Percentage</dt>
                    <dd className="text-sm font-medium">{project.areaBookingPercentage || 0}%</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Payment Collection Percentage</dt>
                    <dd className="text-sm font-medium">{project.financials.collectionPercentage}%</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="technical" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technical Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Project Description</dt>
                    <dd className="text-sm font-medium">{project.projectDescription || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Method of Land Valuation</dt>
                    <dd className="text-sm font-medium">{project.landValuationMethod || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Under Redevelopment</dt>
                    <dd className="text-sm font-medium">{project.underRedevelopment || 'No'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Office Name</dt>
                    <dd className="text-sm font-medium">{project.officeName || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Process Type</dt>
                    <dd className="text-sm font-medium">{project.processType || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Location Status</dt>
                    <dd className="text-sm font-medium">{project.locationStatus || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Airport Distance</dt>
                    <dd className="text-sm font-medium">{project.airportDistance ? `${project.airportDistance} km` : 'Not specified'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Architect Projects</dt>
                    <dd className="text-sm font-medium">{project.architectProjects || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Architect Experience</dt>
                    <dd className="text-sm font-medium">{project.architectExperience ? `${project.architectExperience} years` : 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Engineer Projects</dt>
                    <dd className="text-sm font-medium">{project.engineerProjects || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Engineer Experience</dt>
                    <dd className="text-sm font-medium">{project.engineerExperience ? `${project.engineerExperience} years` : 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Architect Score</dt>
                    <dd className="text-sm font-medium">{project.architectScore || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Engineer Score</dt>
                    <dd className="text-sm font-medium">{project.engineerScore || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">TPO Code</dt>
                    <dd className="text-sm font-medium">{project.tpoCode || 'Not specified'}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Project Score</dt>
                    <dd className="text-sm font-medium">{project.projectScore || 'Not specified'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2">
                    <dt className="text-sm text-muted-foreground">Coordinates</dt>
                    <dd className="text-sm font-medium">
                      {project.coordinates ? 
                        `${project.coordinates.latitude}, ${project.coordinates.longitude}` : 
                        'Not specified'}
                    </dd>
                  </div>
                  {project.coordinates && (
                    <div className="mt-4">
                      <div className="bg-gray-100 rounded-md p-2 text-center">
                        <p className="text-xs text-muted-foreground mb-2">Location Map</p>
                        <a 
                          href={`https://maps.google.com/?q=${project.coordinates.latitude},${project.coordinates.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View on Google Maps
                        </a>
                      </div>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="raw" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Raw Project Data</CardTitle>
              <p className="text-sm text-muted-foreground">Complete raw data from the database</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Field</TableHead>
                      <TableHead className="whitespace-nowrap">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(project).map(([key, value]) => {
                      let displayValue: React.ReactNode;
                      
                      if (typeof value === 'object' && value !== null) {
                        displayValue = (
                          <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-[100px] bg-gray-50 p-2 rounded">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        );
                      } else if (value === null || value === undefined) {
                        displayValue = <span className="text-gray-400 italic">null</span>;
                      } else {
                        displayValue = String(value);
                      }
                      
                      return (
                        <TableRow key={key}>
                          <TableCell className="font-medium whitespace-nowrap">{key}</TableCell>
                          <TableCell>{displayValue}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
