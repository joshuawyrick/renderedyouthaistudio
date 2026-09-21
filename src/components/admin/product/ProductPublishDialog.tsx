
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RYButton } from '@/components/ui/ry-button';
import { RYCard } from '@/components/ui/ry-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Design } from './types';

interface ProductPublishDialogProps {
  design: Design | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

interface Collection {
  id: string;
  name: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
}

interface ProductVariant {
  size: string;
  color: string;
  priceAdjustment: number;
  isAvailable: boolean;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Black', 'White', 'Navy', 'Gray', 'Red', 'Green'];

const ProductPublishDialog: React.FC<ProductPublishDialogProps> = ({
  design,
  open,
  onOpenChange,
  onComplete
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(25.00);
  const [commissionRate, setCommissionRate] = useState(0.15);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (design) {
      setTitle(design.title);
      // Initialize with default variants
      const defaultVariants: ProductVariant[] = [];
      SIZES.forEach(size => {
        COLORS.forEach(color => {
          defaultVariants.push({
            size,
            color,
            priceAdjustment: 0,
            isAvailable: true
          });
        });
      });
      setVariants(defaultVariants);
    }
  }, [design]);

  useEffect(() => {
    if (open) {
      fetchCollections();
      fetchUsers();
    }
  }, [open]);

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .order('first_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handlePublish = async () => {
    if (!design) return;

    setLoading(true);
    try {
      // Update design status to published
      const { error: designError } = await supabase
        .from('designs')
        .update({ status: 'published' })
        .eq('id', design.id);

      if (designError) throw designError;

      // Create product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          title,
          description,
          design_id: design.id,
          price: basePrice,
          base_price: basePrice,
          creator_commission_rate: commissionRate,
          collection_id: selectedCollection || null,
          assigned_user_id: assignedUser || null,
          status: 'active'
        })
        .select()
        .single();

      if (productError) throw productError;

      // Create product variants
      const variantInserts = variants
        .filter(variant => variant.isAvailable)
        .map(variant => ({
          product_id: product.id,
          variant_type: 'size_color',
          size: variant.size,
          color: variant.color,
          price_adjustment: variant.priceAdjustment,
          is_available: variant.isAvailable
        }));

      if (variantInserts.length > 0) {
        const { error: variantsError } = await supabase
          .from('product_variants')
          .insert(variantInserts);

        if (variantsError) throw variantsError;
      }

      toast({
        title: "Success",
        description: `Product "${title}" has been published successfully!`,
      });

      onComplete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error publishing product:', error);
      toast({
        title: "Error",
        description: "Failed to publish product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!design) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publish Product: {design.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Product Info */}
          <RYCard className="p-4">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="basePrice">Base Price ($)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  value={basePrice}
                  onChange={(e) => setBasePrice(parseFloat(e.target.value))}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description..."
                />
              </div>
              <div>
                <Label htmlFor="commissionRate">Creator Commission Rate</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                />
              </div>
            </div>
          </RYCard>

          {/* Collection Assignment */}
          <RYCard className="p-4">
            <h3 className="text-lg font-semibold mb-4">Collection & Assignment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="collection">Collection</Label>
                <select
                  id="collection"
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
                >
                  <option value="">No Collection</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="assignedUser">Assign to User</Label>
                <select
                  id="assignedUser"
                  value={assignedUser}
                  onChange={(e) => setAssignedUser(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
                >
                  <option value="">No Assignment</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </RYCard>

          {/* Product Variants */}
          <RYCard className="p-4">
            <h3 className="text-lg font-semibold mb-4">Product Variants</h3>
            <div className="max-h-96 overflow-y-auto">
              <div className="grid gap-2">
                {variants.map((variant, index) => (
                  <div key={`${variant.size}-${variant.color}`} className="grid grid-cols-5 gap-2 items-center p-2 border rounded">
                    <div className="font-medium">{variant.size}</div>
                    <div>{variant.color}</div>
                    <Input
                      type="number"
                      step="0.01"
                      value={variant.priceAdjustment}
                      onChange={(e) => updateVariant(index, 'priceAdjustment', parseFloat(e.target.value) || 0)}
                      placeholder="Price adjustment"
                    />
                    <div className="text-sm text-gray-600">
                      ${(basePrice + variant.priceAdjustment).toFixed(2)}
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={variant.isAvailable}
                        onChange={(e) => updateVariant(index, 'isAvailable', e.target.checked)}
                        className="mr-2"
                      />
                      Available
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </RYCard>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <RYButton
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </RYButton>
            <RYButton
              variant="primary"
              onClick={handlePublish}
              disabled={loading || !title.trim()}
            >
              {loading ? 'Publishing...' : 'Publish Product'}
            </RYButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPublishDialog;
