import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        // Fetch role from either Profile (Admin) or Staff (Employee)
        const { data: profileData } = await supabase.from('Profile').select('role').eq('id', session.user.id).single();
        const { data: staffData } = await supabase.from('Staff').select('role, status').eq('id', session.user.id).single();
        
        const userProfile = profileData || staffData;
        setProfile(userProfile);
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setProfile(null);
      } else {
        checkUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-luxury-gold animate-spin mb-4" />
        <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-[0.4em]">Establishing Secure Session</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  if (profile?.status === 'Pending Approval') {
    return <Navigate to="/login" state={{ error: 'Your account is currently awaiting administrative approval.' }} replace />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    // If they are a staff member trying to access /admin, send them to their dashboard
    if (profile?.role === 'staff') {
      return <Navigate to="/staff" replace />;
    }
    // Otherwise fallback to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
