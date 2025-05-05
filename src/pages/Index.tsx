
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabase } from "@/hooks/useSupabase";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import PropertyList from "@/components/PropertyList";

const Index = () => {
  const { properties, loading, error, stats, filterProperties, resetFilters } = useSupabase();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
          <p className="text-lg text-gray-600 mb-4">{error}</p>
          <p>Please check your Supabase connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-realestate-primary">
            Ahmedabad Real Estate Vista
          </h1>
          <p className="text-muted-foreground">
            Property analytics and management dashboard for the Ahmedabad region
          </p>
        </div>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="pt-6">
            <Dashboard stats={stats} loading={loading} />
          </TabsContent>
          
          <TabsContent value="properties" className="pt-6">
            <PropertyList 
              properties={properties} 
              loading={loading} 
              onFilterChange={filterProperties}
              onResetFilters={resetFilters}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t bg-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Ahmedabad Real Estate Vista. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
