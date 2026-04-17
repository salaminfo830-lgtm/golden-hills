import DashboardLayout from '../components/DashboardLayout';

import { Routes, Route } from 'react-router-dom';
import AnalyticsOverview from './admin/AnalyticsOverview';
import ReservationsSystem from './admin/ReservationsSystem';
import HRSystem from './admin/HRSystem';
import FinanceSystem from './admin/FinanceSystem';
import KitchenSystem from './admin/KitchenSystem';
import SecuritySystem from './admin/SecuritySystem';
import SettingsSystem from './admin/SettingsSystem';
import RoomsSystem from './admin/RoomsSystem';

const AdminPanel = () => {
  return (
    <DashboardLayout userType="Admin">
      <Routes>
        <Route path="/" element={<AnalyticsOverview />} />
        <Route path="/reservations" element={<ReservationsSystem />} />
        <Route path="/rooms" element={<RoomsSystem />} />
        <Route path="/kitchen" element={<KitchenSystem />} />
        <Route path="/hr" element={<HRSystem />} />
        <Route path="/finance" element={<FinanceSystem />} />
        <Route path="/security" element={<SecuritySystem />} />
        <Route path="/settings" element={<SettingsSystem />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminPanel;
