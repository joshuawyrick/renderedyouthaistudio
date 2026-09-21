
import React, { useState, useEffect } from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { RYCard } from '@/components/ui/ry-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Edit, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  fetchAllDiscountCodes, 
  createDiscountCode, 
  updateDiscountCode, 
  deleteDiscountCode,
  type DiscountCode 
} from '@/services/discountCodeService';

const DiscountCodeManager = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_amount: '',
    usage_limit: '',
    valid_from: '',
    valid_until: '',
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    loadDiscountCodes();
  }, []);

  const loadDiscountCodes = async () => {
    setLoading(true);
    const codes = await fetchAllDiscountCodes();
    setDiscountCodes(codes);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      discount_type: 'percentage',
      discount_amount: '',
      usage_limit: '',
      valid_from: '',
      valid_until: '',
      is_active: true
    });
    setEditingCode(null);
  };

  const handleEdit = (code: DiscountCode) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      name: code.name,
      description: code.description || '',
      discount_type: code.discount_type,
      discount_amount: code.discount_amount.toString(),
      usage_limit: code.usage_limit?.toString() || '',
      valid_from: code.valid_from ? new Date(code.valid_from).toISOString().slice(0, 16) : '',
      valid_until: code.valid_until ? new Date(code.valid_until).toISOString().slice(0, 16) : '',
      is_active: code.is_active
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.discount_amount) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const codeData = {
      code: formData.code,
      name: formData.name,
      description: formData.description || undefined,
      discount_type: formData.discount_type,
      discount_amount: parseFloat(formData.discount_amount),
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : undefined,
      valid_from: formData.valid_from ? new Date(formData.valid_from).toISOString() : undefined,
      valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : undefined,
      is_active: formData.is_active
    };

    let success = false;
    if (editingCode) {
      const result = await updateDiscountCode(editingCode.id, codeData);
      success = result !== null;
    } else {
      const result = await createDiscountCode(codeData);
      success = result !== null;
    }

    if (success) {
      toast({
        title: "Success",
        description: `Discount code ${editingCode ? 'updated' : 'created'} successfully.`,
      });
      setDialogOpen(false);
      resetForm();
      loadDiscountCodes();
    } else {
      toast({
        title: "Error",
        description: "Failed to save discount code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this discount code?')) {
      const success = await deleteDiscountCode(id);
      if (success) {
        toast({
          title: "Success",
          description: "Discount code deleted successfully.",
        });
        loadDiscountCodes();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete discount code.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleActive = async (code: DiscountCode) => {
    const success = await updateDiscountCode(code.id, { is_active: !code.is_active });
    if (success) {
      loadDiscountCodes();
    }
  };

  if (loading) {
    return <div>Loading discount codes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-ry-black">Discount Codes</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <RYButton onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Discount Code
            </RYButton>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCode ? 'Edit Discount Code' : 'Create Discount Code'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="SAVE10"
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="10% Off Sale"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount_type">Type</Label>
                  <Select value={formData.discount_type} onValueChange={(value: 'percentage' | 'fixed') => setFormData({ ...formData, discount_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discount_amount">Amount *</Label>
                  <Input
                    id="discount_amount"
                    type="number"
                    step="0.01"
                    value={formData.discount_amount}
                    onChange={(e) => setFormData({ ...formData, discount_amount: e.target.value })}
                    placeholder={formData.discount_type === 'percentage' ? '10' : '5.00'}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="usage_limit">Usage Limit</Label>
                <Input
                  id="usage_limit"
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valid_from">Valid From</Label>
                  <Input
                    id="valid_from"
                    type="datetime-local"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="valid_until">Valid Until</Label>
                  <Input
                    id="valid_until"
                    type="datetime-local"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <RYButton type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
                  Cancel
                </RYButton>
                <RYButton type="submit">
                  {editingCode ? 'Update' : 'Create'}
                </RYButton>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <RYCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discountCodes.map((code) => (
              <TableRow key={code.id}>
                <TableCell className="font-mono">{code.code}</TableCell>
                <TableCell>{code.name}</TableCell>
                <TableCell className="capitalize">{code.discount_type}</TableCell>
                <TableCell>
                  {code.discount_type === 'percentage' ? `${code.discount_amount}%` : `$${code.discount_amount}`}
                </TableCell>
                <TableCell>
                  {code.usage_count}{code.usage_limit ? `/${code.usage_limit}` : ''}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={code.is_active}
                    onCheckedChange={() => toggleActive(code)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <RYButton
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(code)}
                    >
                      <Edit className="w-4 h-4" />
                    </RYButton>
                    <RYButton
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDelete(code.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </RYButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {discountCodes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No discount codes found. Create your first one!
          </div>
        )}
      </RYCard>
    </div>
  );
};

export default DiscountCodeManager;
