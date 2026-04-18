import DashboardLayout from '../components/DashboardLayout';
import { Routes, Route, Navigate } from 'react-router-dom';

import StaffDashboard from './StaffDashboard';
import RoomsSystem from './admin/RoomsSystem';
import KitchenSystem from './admin/KitchenSystem';
import ReservationsSystem from './admin/ReservationsSystem';

// In a real app we'd fetch this from the authenticated session context.
// Here we simulate an employee who only has specific permissions:
const MOCK_STAFF_PERMISSIONS = ['rooms', 'kitchen']; 

const ProtectedModule = ({ id, children }) => {
   if (!MOCK_STAFF_PERMISSIONS.includes(id)) {
      return (
         <div className="flex flex-col items-center justify-center p-20 text-center">
            <h2 className="text-2xl font-bold font-serif mb-2 text-luxury-black">Access Denied</h2>
            <p className="text-gray-500 max-w-md">You do not have the required permissions assigned by the Administration to access this module.</p>
         </div>
      );
   }
   return children;
};

const StaffPanel = () => {
  return (
    <DashboardLayout userType="Employee">
      <Routes>
        <Route path="/" element={<StaffDashboard />} />
        <Route path="/rooms" element={
           <ProtectedModule id="rooms">
              <RoomsSystem userType="Employee" />
           </ProtectedModule>
        } />
        <Route path="/kitchen" element={
           <ProtectedModule id="kitchen">
              <KitchenSystem userType="Employee" />
           </ProtectedModule>
        } />
        <Route path="/reservations" element={
           <ProtectedModule id="reservations">
              <ReservationsSystem userType="Employee" />
           </ProtectedModule>
        } />
        {/* We can route other things but deny them or simply catchall */}
        <Route path="*" element={<Navigate to="/staff" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StaffPanel;
