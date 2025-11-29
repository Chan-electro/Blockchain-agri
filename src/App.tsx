import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RoleSelection from './pages/RoleSelection';
import FarmerDashboard from './pages/FarmerDashboard';
import ProcessorDashboard from './pages/ProcessorDashboard';
import LogisticsDashboard from './pages/LogisticsDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ConsumerScan from './pages/ConsumerScan';
import ConsumerBatchDetails from './pages/ConsumerBatchDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-role" element={<RoleSelection />} />

        {/* Role Dashboards */}
        <Route path="/farmer/*" element={<FarmerDashboard />} />
        <Route path="/processor/*" element={<ProcessorDashboard />} />
        <Route path="/logistics/*" element={<LogisticsDashboard />} />
        <Route path="/retailer/*" element={<RetailerDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* Consumer Flow */}
        <Route path="/scan" element={<ConsumerScan />} />
        <Route path="/product/:id" element={<ConsumerBatchDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
