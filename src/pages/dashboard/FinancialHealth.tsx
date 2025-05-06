
import React from "react";
import { useProjectSummaryQuery } from "@/hooks/useProjectsQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin, Building, CircleDollarSign, 
  TrendingUp, BarChart3, Layers, ArrowUp, ArrowDown, ArrowRight 
} from "lucide-react";
import ProjectValueChart from "@/components/charts/ProjectValueChart";

// Helper functions
const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lac`;
  } else {
    return `₹${amount.toLocaleString()}`;
  }
};

const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// YoY Change Indicator Component
const YoYChangeIndicator = ({ value, reverse = false }: { value: number | undefined, reverse?: boolean }) => {
  if (value === undefined) return null;
  
  const isPositive = reverse ? value < 0 : value > 0;
  const isNeutral = value === 0;
  
  return (
    <div className={`flex items-center ml-2 text-xs ${
      isNeutral ? 'text-gray-500' : 
      isPositive ? 'text-green-500' : 'text-red-500'
    }`}>
      {isNeutral ? (
        <ArrowRight className="h-3 w-3 mr-1" />
      ) : isPositive ? (
        <ArrowUp className="h-3 w-3 mr-1" />
      ) : (
        <ArrowDown className="h-3 w-3 mr-1" />
      )}
      <span>{Math.abs(value).toFixed(1)}%</span>
    </div>
  );
};

const FinancialHealth = () => {
  const { data: summary, isLoading, isError, error } = useProjectSummaryQuery();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[300px]">
      <p>Loading financial health data...</p>
    </div>;
  }

  if (isError || !summary) {
    return <div className="flex justify-center items-center min-h-[300px]">
      <p>Error loading data: {(error as Error)?.message || "Unknown error"}</p>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Financial Health</h2>
        <p className="text-muted-foreground">Financial metrics and performance indicators</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Land Cost</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                {formatCurrency(summary.financials?.landCost || 0)}
              </div>
              {summary.financials?.yoyLandCost !== undefined && (
                <YoYChangeIndicator value={summary.financials.yoyLandCost} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total land acquisition cost
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Development Cost</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                {formatCurrency(summary.financials?.developmentCost || 0)}
              </div>
              {summary.financials?.yoyDevelopmentCost !== undefined && (
                <YoYChangeIndicator value={summary.financials.yoyDevelopmentCost} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total development expenses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxes & Premiums</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.financials?.taxesAndPremiums || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total tax and premium payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interest Charges</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.financials?.interestCharges || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total interest paid to financing
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.financials?.netCashFlow || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Net cash flow from projects
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Variance</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                {formatPercentage(summary.financials?.avgCostVariance || 0)}
              </div>
              {summary.financials?.yoyCostVariance !== undefined && (
                <YoYChangeIndicator value={summary.financials.yoyCostVariance} reverse={true} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Average cost variance from estimates
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Land vs Development Cost Split</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <div className="flex h-full w-full items-center justify-center">
            <ProjectValueChart 
              totalValue={summary.financials?.landCost || 0} 
              receivedAmount={summary.financials?.developmentCost || 0}
              labelA="Land Cost"
              labelB="Development Cost"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialHealth;
