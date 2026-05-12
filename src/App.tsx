import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PaperProvider } from "@/contexts/PaperContext";
import OptionChain from "./pages/OptionChain";
import StrategyBuilder from "./pages/StrategyBuilder";
import PaperTrading from "./pages/PaperTrading";
import OIAnalysis from "./pages/OIAnalysis";
import Positions from "./pages/Positions";
import PricingPage from "./pages/PricingPage";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  return <Navigate to={user ? "/dashboard" : "/auth"} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <PaperProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/option-chain" element={<OptionChain />} />
                <Route path="/strategy-builder" element={<StrategyBuilder />} />
                <Route path="/paper-trading" element={<ProtectedRoute><PaperTrading /></ProtectedRoute>} />
                <Route path="/oi-analysis" element={<OIAnalysis />} />
                <Route path="/positions" element={<ProtectedRoute><Positions /></ProtectedRoute>} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/admin" element={<ProtectedRoute require="admin"><Admin /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </PaperProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
