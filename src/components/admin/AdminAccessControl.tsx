
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import TopNav from '@/components/navigation/TopNav';
import { RYCard } from '@/components/ui/ry-card';
import { useToast } from '@/components/ui/use-toast';

interface AdminAccessControlProps {
  children: React.ReactNode;
}

const AdminAccessControl = ({ children }: AdminAccessControlProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
      setLoading(false);
      setHasChecked(true);
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
      }

      const adminStatus = !!data;
      setIsAdmin(adminStatus);
      setLoading(false);
      setHasChecked(true);
      
      // Only show access denied toast if user is authenticated, check is complete, and they're not an admin
      if (user && !adminStatus && hasChecked === false) {
        // Use setTimeout to ensure this runs after state updates
        setTimeout(() => {
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges",
            variant: "destructive",
          });
        }, 100);
      }
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      setIsAdmin(false);
      setLoading(false);
      setHasChecked(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-2xl text-ry-black">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <RYCard className="p-8 text-center">
            <h1 className="text-2xl font-bold text-ry-black mb-4">
              Please Sign In
            </h1>
            <p className="text-gray-600 mb-4">
              You need to be signed in to access the admin dashboard.
            </p>
            <a 
              href="/auth" 
              className="inline-block bg-ry-yellow text-ry-black px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Sign In
            </a>
          </RYCard>
        </div>
      </div>
    );
  }

  if (!isAdmin && hasChecked) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <RYCard className="p-8 text-center">
            <h1 className="text-2xl font-bold text-ry-black mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600">
              You don't have permission to access this page.
            </p>
          </RYCard>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAccessControl;
