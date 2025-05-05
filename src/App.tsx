
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <AppLayout>
              <Index />
            </AppLayout>
          } 
        />
        <Route 
          path="/projects" 
          element={
            <AppLayout>
              <Projects />
            </AppLayout>
          } 
        />
        <Route 
          path="/projects/:id" 
          element={
            <AppLayout>
              <ProjectDetail />
            </AppLayout>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <AppLayout>
              <Reports />
            </AppLayout>
          } 
        />
        <Route 
          path="/market-analysis" 
          element={
            <AppLayout>
              <MarketAnalysis />
            </AppLayout>
          } 
        />
        <Route 
          path="/trends" 
          element={
            <AppLayout>
              <TrendAnalysis />
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
