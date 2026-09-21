import { supabase } from '@/integrations/supabase/client';

export interface DesignDeletionResult {
  success: boolean;
  error?: string;
}

export const deleteDesignAndRelatedData = async (designId: string): Promise<DesignDeletionResult> => {
  try {
    // Start a transaction-like process by deleting in the correct order
    
    // 1. Delete any products that reference this design
    const { error: productsError } = await supabase
      .from('products')
      .delete()
      .eq('design_id', designId);

    if (productsError) {
      console.error('Error deleting related products:', productsError);
      return { success: false, error: 'Failed to delete related products' };
    }

    // 2. Delete design selections first (they reference mockups)
    const { error: selectionsError } = await supabase
      .from('design_selections')
      .delete()
      .eq('design_id', designId);

    if (selectionsError) {
      console.error('Error deleting design selections:', selectionsError);
      return { success: false, error: 'Failed to delete design selections' };
    }

    // 3. Delete design mockups (after selections are deleted)
    const { error: mockupsError } = await supabase
      .from('design_mockups')
      .delete()
      .eq('design_id', designId);

    if (mockupsError) {
      console.error('Error deleting design mockups:', mockupsError);
      return { success: false, error: 'Failed to delete design mockups' };
    }

    // 4. Finally, delete the design itself
    const { error: designError } = await supabase
      .from('designs')
      .delete()
      .eq('id', designId);

    if (designError) {
      console.error('Error deleting design:', designError);
      return { success: false, error: 'Failed to delete design' };
    }

    return { success: true };

  } catch (error) {
    console.error('Unexpected error during design deletion:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

export const bulkDeleteDesigns = async (designIds: string[]): Promise<DesignDeletionResult> => {
  try {
    const results = await Promise.all(
      designIds.map(id => deleteDesignAndRelatedData(id))
    );

    const failed = results.filter(r => !r.success);
    
    if (failed.length > 0) {
      return { 
        success: false, 
        error: `Failed to delete ${failed.length} designs` 
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in bulk delete:', error);
    return { 
      success: false, 
      error: 'Failed to bulk delete designs' 
    };
  }
};