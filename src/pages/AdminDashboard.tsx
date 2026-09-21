import React, { useState, useRef, useCallback } from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import DesignActionsDialog from '@/components/admin/DesignActionsDialog';
import AdminStats from '@/components/admin/AdminStats';
import DesignStatusCards from '@/components/admin/DesignStatusCards';
import AdminAccessControl from '@/components/admin/AdminAccessControl';
import AdminDashboardHeader from '@/components/admin/AdminDashboardHeader';
import CollectionManager from '@/components/admin/CollectionManager';
import DesignCollectionAssigner from '@/components/admin/DesignCollectionAssigner';
import ProductManager from '@/components/admin/ProductManager';
import TuckersTeesManager from '@/components/admin/TuckersTeesManager';
import NavigationSettings from '@/components/admin/NavigationSettings';
import DiscountCodeManager from '@/components/admin/DiscountCodeManager';
import AdminTabs, { type AdminTabId } from '@/components/admin/AdminTabs';
import type { Design } from '@/components/admin/design-status/types';

const AdminDashboard = () => {
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTabId>('overview');
  const designSectionRef = useRef<HTMLDivElement>(null);

  const handleDesignClick = useCallback((design: Design) => {
    setSelectedDesign(design);
    setDialogOpen(true);
  }, []);

  const handleDialogComplete = useCallback(() => {
    setDialogOpen(false);
    setSelectedDesign(null);
  }, []);

  const handleStatusClick = useCallback((status: string) => {
    setActiveTab('overview');
    
    if (designSectionRef.current) {
      designSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      setTimeout(() => {
        const statusElement = document.getElementById(`status-${status}`);
        statusElement?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div className="mb-12">
              <AdminStats onStatusClick={handleStatusClick} />
            </div>
            <div className="mb-12" ref={designSectionRef}>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Design Management
              </h2>
              <DesignStatusCards onDesignClick={handleDesignClick} />
            </div>
          </>
        );
      case 'products':
        return <ProductManager />;
      case 'collections':
        return <CollectionManager />;
      case 'assign':
        return <DesignCollectionAssigner />;
      case 'discounts':
        return <DiscountCodeManager />;
      case 'navigation':
        return <NavigationSettings />;
      case 'tuckers':
        return <TuckersTeesManager />;
      default:
        return null;
    }
  };

  return (
    <AdminAccessControl>
      <div className="min-h-screen bg-background">
        <TopNav />
        
        <div className="pt-40">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <AdminDashboardHeader />
            <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
            {renderTabContent()}
          </main>
        </div>

        <DesignActionsDialog
          design={selectedDesign}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onComplete={handleDialogComplete}
        />

        <Footer />
      </div>
    </AdminAccessControl>
  );
};

export default AdminDashboard;
