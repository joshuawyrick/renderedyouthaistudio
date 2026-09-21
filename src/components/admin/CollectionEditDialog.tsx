
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RYButton } from '@/components/ui/ry-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Collection {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  is_active: boolean;
  sort_order: number;
  page_header: string | null;
  page_description: string | null;
}

interface CollectionEditDialogProps {
  collection: Collection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const CollectionEditDialog: React.FC<CollectionEditDialogProps> = ({
  collection,
  open,
  onOpenChange,
  onUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: collection?.name || '',
    description: collection?.description || '',
    page_header: collection?.page_header || '',
    page_description: collection?.page_description || '',
    is_active: collection?.is_active || false,
    sort_order: collection?.sort_order || 0
  });
  const { toast } = useToast();

  React.useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name || '',
        description: collection.description || '',
        page_header: collection.page_header || '',
        page_description: collection.page_description || '',
        is_active: collection.is_active || false,
        sort_order: collection.sort_order || 0
      });
    }
  }, [collection]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleSave = async () => {
    if (!collection) return;

    setLoading(true);
    try {
      const slug = generateSlug(formData.name);
      
      const { error } = await supabase
        .from('collections')
        .update({
          name: formData.name,
          description: formData.description || null,
          page_header: formData.page_header || null,
          page_description: formData.page_description || null,
          is_active: formData.is_active,
          sort_order: formData.sort_order,
          slug: slug,
          updated_at: new Date().toISOString()
        })
        .eq('id', collection.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Collection updated successfully",
      });

      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating collection:', error);
      toast({
        title: "Error",
        description: "Failed to update collection",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Collection Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter collection name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Collection Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this collection"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="page_header">Page Header</Label>
            <Input
              id="page_header"
              value={formData.page_header}
              onChange={(e) => setFormData(prev => ({ ...prev, page_header: e.target.value }))}
              placeholder="Header text for collection page"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="page_description">Page Description</Label>
            <Textarea
              id="page_description"
              value={formData.page_description}
              onChange={(e) => setFormData(prev => ({ ...prev, page_description: e.target.value }))}
              placeholder="Description paragraph for collection page"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort Order</Label>
            <Input
              id="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              placeholder="Display order (lower numbers first)"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Show in navigation (active)</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <RYButton
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </RYButton>
            <RYButton
              variant="primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </RYButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionEditDialog;
