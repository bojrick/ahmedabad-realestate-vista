
import React from "react";
import { useProjectSummaryQuery } from "@/hooks/useProjectsQuery";
import EnhancedDashboard from "@/components/EnhancedDashboard";

const Index = () => {
  const {
    data: summary,
    isLoading,
    isError,
    error
  } = useProjectSummaryQuery();
  
  if (isError) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
          <p className="text-lg text-gray-600 mb-4">{(error as Error)?.message || "An unknown error occurred"}</p>
          <p>Please check your Supabase connection and try again.</p>
        </div>
      </div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <EnhancedDashboard summary={summary} loading={isLoading} />
      </main>
      
      <footer className="border-t bg-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Gujarat RERA Project Analytics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
