import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole, public: isPublic }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        // Emergency bypass for primary admin account
        if (session.user.email === 'admin@gmail.com') {
          setProfile({ role: 'admin', status: 'Active' });
          setLoading(false);
          return;
        }

        // Fetch role from either Profile (Admin) or Staff (Employee)
        const { data: profileData } = await supabase.from('Profile').select('role').eq('id', session.user.id).single();
        const { data: staffData } = await supabase.from('Staff').select('role, status').eq('id', session.user.id).single();
        
        let userProfile = profileData || staffData;
        
        // Fallback for seeded admin account
        if (!userProfile && session.user.email === 'fares@goldenhills.dz') {
          userProfile = { role: 'admin', status: 'Active' };
        }
        
        if (userProfile) {
          setProfile(userProfile);
        } else {
          // If authenticated but no DB record exists, we might need to create it
          // For security, we fallback to a safe state
          setProfile({ role: 'unauthorized' });
        }
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
    if (isPublic) return children;
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  // Allow all users (Guests, Admin, Staff) to stay on public routes
  if (isPublic) {
    return children;
  }

  // Handle Staff Status
  if (profile?.role === 'staff' && (profile?.status === 'Pending Approval' || profile?.status === 'Rejected')) {
    if (window.location.pathname !== '/status') {
      return <Navigate to="/status" replace />;
    }
  }

  if (requiredRole && profile?.role !== requiredRole) {
    // Redirect based on identity if accessing unauthorized route
    if (profile?.role === 'admin') return <Navigate to="/admin" replace />;
    if (profile?.role === 'staff') return <Navigate to="/staff" replace />;
    if (profile?.role === 'guest') return <Navigate to="/dashboard" replace />;
    
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
