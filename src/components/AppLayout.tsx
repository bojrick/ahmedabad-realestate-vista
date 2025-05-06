
import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import RealEstateSidebar from "./RealEstateSidebar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full min-h-screen bg-background">
          <RealEstateSidebar />
          <SidebarInset className="pb-8">
            <div className="container mx-auto px-4 py-6">
              {children}
            </div>
          </SidebarInset>
        </div>
        <Toaster />
        <Sonner />
      </SidebarProvider>
    </AuthProvider>
  );
};

export default AppLayout;
