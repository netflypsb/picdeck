import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import FreeDashboard from "./pages/FreeDashboard";
import ProDashboard from "./pages/ProDashboard";
import PremiumDashboard from "./pages/PremiumDashboard";
import AlphaTesterDashboard from "./pages/AlphaTesterDashboard";
import Account from "./pages/Account";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/free-dashboard" element={<FreeDashboard />} />
          <Route path="/pro-dashboard" element={<ProDashboard />} />
          <Route path="/premium-dashboard" element={<PremiumDashboard />} />
          <Route path="/alpha-tester-dashboard" element={<AlphaTesterDashboard />} />
          <Route path="/account" element={<Account />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;