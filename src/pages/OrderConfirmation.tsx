import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useSeo } from '@/hooks/useSeo';

interface ConfirmedOrder {
  id: string;
  customer_email: string;
  total_amount: number;
  payment_status: string;
  order_items: {
    id: string;
    product_title: string;
    size: string | null;
    color: string | null;
    quantity: number;
    line_total: number;
  }[];
}

const OrderConfirmation = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const { clearCart } = useCart();
  const [order, setOrder] = useState<ConfirmedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const cleared = useRef(false);

  useSeo({ title: 'Order Confirmed | Rendered Youth', noIndex: true });

  useEffect(() => {
    if (!sessionId) {
      setError('We could not find that order.');
      setLoading(false);
      return;
    }

    const confirm = async () => {
      const { data, error: fnError } = await supabase.functions.invoke('confirm-order', {
        body: { sessionId },
      });

      const message = (data as any)?.error ?? fnError?.message;
      if (message) {
        setError(message);
      } else {
        setOrder((data as any)?.order ?? null);
        if ((data as any)?.paid && !cleared.current) {
          cleared.current = true;
          clearCart();
        }
      }
      setLoading(false);
    };

    confirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-ry-white flex flex-col">
      <TopNav />
      <div className="pt-40 flex-1">
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <p className="text-gray-600 text-center">Confirming your order...</p>
          ) : error ? (
            <RYCard className="p-8 text-center space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-red-600" />
              <h1 className="text-3xl font-bold text-ry-black">We couldn't confirm your order</h1>
              <p className="text-gray-600">{error}</p>
              <Link to="/store">
                <RYButton variant="primary" size="lg">Back to the Store</RYButton>
              </Link>
            </RYCard>
          ) : (
            <RYCard className="p-8 space-y-6">
              <div className="text-center space-y-3">
                <CheckCircle2 className="h-14 w-14 mx-auto text-green-600" />
                <h1 className="text-3xl font-bold text-ry-black">Thank you for your order!</h1>
                <p className="text-gray-600">
                  A confirmation is on its way to {order?.customer_email}. Every purchase sends a
                  royalty straight to the young artist who made the design.
                </p>
              </div>

              {order && (
                <div className="border-t border-gray-200 pt-6 space-y-2">
                  <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {order.order_items?.map((item) => (
                      <li key={item.id} className="flex justify-between gap-3">
                        <span>
                          {item.quantity}x {item.product_title}
                          {item.size ? ` — ${item.size}` : ''}
                          {item.color ? ` / ${item.color}` : ''}
                        </span>
                        <span className="font-semibold">${Number(item.line_total).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between font-bold text-ry-black pt-2">
                    <span>Total</span>
                    <span>${Number(order.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/orders" className="flex-1">
                  <RYButton variant="primary" size="lg" className="w-full">View Your Orders</RYButton>
                </Link>
                <Link to="/store" className="flex-1">
                  <RYButton variant="secondary" size="lg" className="w-full">Keep Shopping</RYButton>
                </Link>
              </div>
            </RYCard>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
