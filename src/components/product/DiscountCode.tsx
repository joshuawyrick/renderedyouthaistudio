
import React, { useState } from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { fetchDiscountCode } from '@/services/discountCodeService';

interface DiscountCodeProps {
  onDiscountApplied: (discount: { code: string; amount: number; type: 'percentage' | 'fixed' }) => void;
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ onDiscountApplied }) => {
  const [discountCode, setDiscountCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setIsApplying(true);
    
    try {
      const code = await fetchDiscountCode(discountCode.trim());
      
      if (code) {
        onDiscountApplied({ 
          code: code.code, 
          amount: code.discount_amount, 
          type: code.discount_type 
        });
        toast({
          title: "Discount Applied!",
          description: `${code.code} discount has been applied to your order.`,
        });
      } else {
        toast({
          title: "Invalid Code",
          description: "The discount code you entered is not valid or has expired.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error applying discount:', error);
      toast({
        title: "Error",
        description: "There was an error applying the discount code. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsApplying(false);
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold text-ry-black mb-3">Discount Code</h3>
      <div className="flex gap-2">
        <Input
          placeholder="Enter discount code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          className="flex-1"
        />
        <RYButton
          onClick={handleApplyDiscount}
          disabled={isApplying || !discountCode.trim()}
          variant="secondary"
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </RYButton>
      </div>
    </div>
  );
};

export default DiscountCode;
