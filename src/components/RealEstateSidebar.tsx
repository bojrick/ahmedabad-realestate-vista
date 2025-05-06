
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  PieChart, BarChart, Table, Filter, FileText,
  ChartPie, TrendingUp, CircleDollarSign, LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

const RealEstateSidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const isActiveGroup = (pathPrefix: string) => {
    return location.pathname.startsWith(pathPrefix);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-14 items-center px-4 font-semibold tracking-tight text-lg">
          <span className="text-realestate-primary">Gujarat RERA Analytics</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/")}
                  tooltip="Dashboard"
                >
                  <Link to="/">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* Dashboard Sub-Navigation */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/market-overview")}
                  tooltip="Market Overview"
                >
                  <Link to="/dashboard/market-overview">
                    <ChartPie className="h-5 w-5" />
                    <span>Market Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/project-pipeline")}
                  tooltip="Project Pipeline"
                >
                  <Link to="/dashboard/project-pipeline">
                    <BarChart className="h-5 w-5" />
                    <span>Project Pipeline</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/financial-health")}
                  tooltip="Financial Health"
                >
                  <Link to="/dashboard/financial-health">
                    <CircleDollarSign className="h-5 w-5" />
                    <span>Financial Health</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/performance")}
                  tooltip="Performance"
                >
                  <Link to="/dashboard/performance">
                    <TrendingUp className="h-5 w-5" />
                    <span>Performance</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/projects")}
                  tooltip="Projects"
                >
                  <Link to="/projects">
                    <Table className="h-5 w-5" />
                    <span>Projects Explorer</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/reports")}
                  tooltip="Reports"
                >
                  <Link to="/reports">
                    <FileText className="h-5 w-5" />
                    <span>Custom Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/market-analysis")}
                  tooltip="Market Analysis"
                >
                  <Link to="/market-analysis">
                    <PieChart className="h-5 w-5" />
                    <span>Market Analysis</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/trends")}
                  tooltip="Trends"
                >
                  <Link to="/trends">
                    <Filter className="h-5 w-5" />
                    <span>Trend Analysis</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-2">
            Gujarat RERA Project Analytics Dashboard
          </p>
          <Button variant="outline" size="sm" className="w-full">
            Export Data
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default RealEstateSidebar;
