import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';

import StaffDashboard from './StaffDashboard';
import HousekeepingDashboard from './staff/HousekeepingDashboard';
import FrontDeskDashboard from './staff/FrontDeskDashboard';
import RoomsSystem from './admin/RoomsSystem';
import KitchenSystem from './admin/KitchenSystem';
import ReservationsSystem from './admin/ReservationsSystem';
import SecuritySystem from './admin/SecuritySystem';
import FinanceSystem from './admin/FinanceSystem';

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
  const [staffInfo, setStaffInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('Staff')
          .select('*')
          .eq('id', user.id)
          .single();
        setStaffInfo(data);
      }
      setLoading(false);
    };
    fetchStaff();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#fafafa]">
         <Loader2 className="w-10 h-10 text-luxury-gold animate-spin" />
      </div>
    );
  }

  // Determine dashboard based on department
  const renderDashboard = () => {
    if (!staffInfo) return <StaffDashboard />;
    
    switch (staffInfo.department) {
      case 'Housekeeping':
        return <HousekeepingDashboard />;
      case 'Front Desk':
      case 'Administration':
        return <FrontDeskDashboard />;
      case 'Kitchen':
        return <KitchenSystem userType="Employee" />;
      case 'Security':
        return <SecuritySystem userType="Employee" />;
      case 'Finance':
        return <FinanceSystem userType="Employee" />;
      default:
        return <StaffDashboard staff={staffInfo} />;
    }
  };

  return (
    <DashboardLayout userType={staffInfo?.role?.toUpperCase() || 'STAFF'}>
      <Routes>
        <Route path="/" element={renderDashboard()} />
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
        <Route path="*" element={<Navigate to="/staff" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StaffPanel;

