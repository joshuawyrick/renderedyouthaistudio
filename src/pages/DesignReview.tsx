
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYButton } from '@/components/ui/ry-button';
import { useDesignReview } from '@/hooks/useDesignReview';
import DesignHeader from '@/components/design-review/DesignHeader';
import MockupGrid from '@/components/design-review/MockupGrid';
import CompletedState from '@/components/design-review/CompletedState';
import EmptyState from '@/components/design-review/EmptyState';

const DesignReview = () => {
  const [searchParams] = useSearchParams();
  const designId = searchParams.get('design');
  

  const {
    design,
    mockups,
    selectedMockup,
    setSelectedMockup,
    loading,
    submitting,
    submitted,
    submitSelection,
  } = useDesignReview(designId);

  if (loading) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-40 flex items-center justify-center min-h-screen">
          <div className="text-2xl text-ry-black">Loading your designs...</div>
        </div>
      </div>
    );
  }

  if (!designId) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-40 flex items-center justify-center min-h-screen">
          <div className="text-2xl text-ry-black">No design ID provided</div>
        </div>
      </div>
    );
  }

  if (!design || mockups.length === 0) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <EmptyState />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <CompletedState designTitle={design.title} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-40">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <DesignHeader designTitle={design.title} />
          
          <MockupGrid
            mockups={mockups}
            selectedMockup={selectedMockup}
            onSelectMockup={setSelectedMockup}
          />

          {selectedMockup && (
            <div className="text-center">
              <RYButton
                variant="primary"
                size="lg"
                onClick={submitSelection}
                disabled={submitting}
                className="text-xl px-12 py-4"
              >
                {submitting ? 'Saving...' : 'This is the One! 🎉'}
              </RYButton>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DesignReview;
