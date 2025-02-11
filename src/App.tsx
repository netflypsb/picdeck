
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import Auth from './pages/Auth';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Account from './pages/Account';
import FreeDashboard from './pages/FreeDashboard';
import PlatinumDashboard from './pages/PlatinumDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/account" element={<Account />} />
        <Route path="/free-dashboard" element={<FreeDashboard />} />
        <Route path="/platinum-dashboard" element={<PlatinumDashboard />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
