import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';

import StaffDashboard from './StaffDashboard';
import RoomsSystem from './admin/RoomsSystem';
import KitchenSystem from './admin/KitchenSystem';
import ReservationsSystem from './admin/ReservationsSystem';

const ProtectedModule = ({ id, children }) => {
   const [permissions, setPermissions] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchPermissions = async () => {
         const { data: { session } } = await supabase.auth.getSession();
         if (session) {
            const { data } = await supabase.from('Staff').select('permissions').eq('id', session.user.id).single();
            setPermissions(data?.permissions || []);
         }
         setLoading(false);
      };
      fetchPermissions();
   }, []);

   if (loading) return (
      <div className="flex justify-center p-20">
         <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
      </div>
   );

   if (!permissions.includes(id)) {
      return (
         <div className="flex flex-col items-center justify-center p-20 text-center">
            <h2 className="text-2xl font-bold font-serif mb-2 text-luxury-black font-elegant">Access Denied</h2>
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
