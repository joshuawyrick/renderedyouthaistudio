
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';

interface DiscountInfo {
  code: string;
  amount: number;
  type: 'percentage' | 'fixed';
}

interface OrderSummaryProps {
  basePrice: number;
  variantAdjustment: number;
  discount?: DiscountInfo;
  tax?: number;
  shipping?: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  basePrice,
  variantAdjustment,
  discount,
  tax = 0,
  shipping = 0
}) => {
  const subtotal = basePrice + variantAdjustment;
  
  let discountAmount = 0;
  if (discount) {
    discountAmount = discount.type === 'percentage' 
      ? (subtotal * discount.amount) / 100
      : discount.amount;
  }
  
  const total = subtotal - discountAmount + tax + shipping;

  return (
    <RYCard className="p-4">
      <h3 className="font-semibold text-ry-black mb-4">Order Summary</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {variantAdjustment !== 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Variant adjustment:</span>
            <span>
              {variantAdjustment > 0 ? '+' : ''}${variantAdjustment.toFixed(2)}
            </span>
          </div>
        )}
        
        {discount && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({discount.code}):</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        {shipping > 0 && (
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
        )}
        
        {tax > 0 && (
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        )}
        
        <hr className="my-2" />
        
        <div className="flex justify-between font-semibold text-lg">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </RYCard>
  );
};

export default OrderSummary;
