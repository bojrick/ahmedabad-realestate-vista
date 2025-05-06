
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Reports from "./pages/Reports";
import MarketAnalysis from "./pages/MarketAnalysis";
import TrendAnalysis from "./pages/TrendAnalysis";
import MarketOverview from "./pages/dashboard/MarketOverview";
import ProjectPipeline from "./pages/dashboard/ProjectPipeline";
import FinancialHealth from "./pages/dashboard/FinancialHealth";
import Performance from "./pages/dashboard/Performance";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route 
          path="/auth" 
          element={<Auth />} 
        />
        <Route 
          path="/" 
          element={
            <AppLayout>
              <Index />
            </AppLayout>
          } 
        />
        <Route 
          path="/dashboard/market-overview" 
          element={
            <AppLayout>
              <MarketOverview />
            </AppLayout>
          } 
        />
        <Route 
          path="/dashboard/project-pipeline" 
          element={
            <AppLayout>
              <ProjectPipeline />
            </AppLayout>
          } 
        />
        <Route 
          path="/dashboard/financial-health" 
          element={
            <AppLayout>
              <FinancialHealth />
            </AppLayout>
          } 
        />
        <Route 
          path="/dashboard/performance" 
          element={
            <AppLayout>
              <Performance />
            </AppLayout>
          } 
        />
        {/* Protected Routes */}
        <Route 
          path="/projects" 
          element={
            <AppLayout>
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            </AppLayout>
          } 
        />
        <Route 
          path="/projects/:id" 
          element={
            <AppLayout>
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            </AppLayout>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <AppLayout>
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            </AppLayout>
          } 
        />
        <Route 
          path="/market-analysis" 
          element={
            <AppLayout>
              <ProtectedRoute>
                <MarketAnalysis />
              </ProtectedRoute>
            </AppLayout>
          } 
        />
        <Route 
          path="/trends" 
          element={
            <AppLayout>
              <ProtectedRoute>
                <TrendAnalysis />
              </ProtectedRoute>
            </AppLayout>
          } 
        />
        <Route 
          path="*" 
          element={
            <AppLayout>
              <NotFound />
            </AppLayout>
          } 
        />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
