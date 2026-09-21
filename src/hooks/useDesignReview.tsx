
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Mockup {
  id: string;
  mockup_url: string;
  mockup_order: number;
  style_label?: string | null;
}

interface Design {
  id: string;
  title: string;
  status: string;
}

export const useDesignReview = (designId: string | null) => {
  const [design, setDesign] = useState<Design | null>(null);
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [selectedMockup, setSelectedMockup] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const fetchDesignAndMockups = async () => {
    if (!designId) {
      console.error('No design ID provided');
      setLoading(false);
      return;
    }

    try {
      
      // Fetch design details
      const { data: designData, error: designError } = await supabase
        .from('designs')
        .select('id, title, status')
        .eq('id', designId)
        .single();

      if (designError) {
        console.error('Design fetch error:', designError);
        throw designError;
      }

      setDesign(designData);

      // Fetch mockups first
      const { data: mockupsData, error: mockupsError } = await supabase
        .from('design_mockups')
        .select('id, mockup_url, mockup_order, style_label')
        .eq('design_id', designId)
        .order('mockup_order');

      if (mockupsError) {
        console.error('Mockups fetch error:', mockupsError);
        throw mockupsError;
      }

      const mockups = mockupsData || [];
      setMockups(mockups);

      // Check if already selected - only if mockups exist
      if (mockups.length > 0) {
        const { data: selectionData } = await supabase
          .from('design_selections')
          .select('selected_mockup_id')
          .eq('design_id', designId)
          .maybeSingle();

        // Validate that the selected mockup still exists in the current mockups
        if (selectionData && mockups.some(m => m.id === selectionData.selected_mockup_id)) {
          setSubmitted(true);
          setSelectedMockup(selectionData.selected_mockup_id);
        } else if (selectionData) {
          // Clear invalid selection
          await supabase
            .from('design_selections')
            .delete()
            .eq('design_id', designId);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Couldn't load your design. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitSelection = async () => {
    if (!selectedMockup || !designId) return;

    setSubmitting(true);
    try {
      // Save the selection
      const { error } = await supabase
        .from('design_selections')
        .insert({
          design_id: designId,
          selected_mockup_id: selectedMockup,
        });

      if (error) throw error;

      // Update design status to 'selected'
      await supabase
        .from('designs')
        .update({ status: 'selected' })
        .eq('id', designId);

      // Notify admins of the selection
      try {
        await supabase.functions.invoke('notify-admin-selection', {
          body: {
            designId,
            selectedMockupId: selectedMockup,
          },
        });
      } catch (notificationError) {
        console.error('Failed to send admin notification:', notificationError);
        // Don't fail the whole process if notification fails
      }

      setSubmitted(true);
      toast({
        title: "Perfect!",
        description: "Your design choice has been saved. It will go live soon!",
      });
    } catch (error) {
      console.error('Error submitting selection:', error);
      toast({
        title: "Error",
        description: "Couldn't save your choice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchDesignAndMockups();
  }, [designId]);

  return {
    design,
    mockups,
    selectedMockup,
    setSelectedMockup,
    loading,
    submitting,
    submitted,
    submitSelection,
  };
};
