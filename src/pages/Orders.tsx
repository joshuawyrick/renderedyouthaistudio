import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSeo } from '@/hooks/useSeo';

interface OrderRow {
  id: string;
  created_at: string;
  status: string;
  payment_status: string;
  total_amount: number;
  tracking_number: string | null;
  order_items: { id: string; product_title: string; size: string | null; color: string | null; quantity: number }[];
}

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useSeo({ title: 'Your Orders | Rendered Youth', noIndex: true });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      window.location.href = '/auth';
      return;
    }

    const load = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, created_at, status, payment_status, total_amount, tracking_number, order_items(id, product_title, size, color, quantity)')
        .order('created_at', { ascending: false });

      if (error) console.error('Error loading orders:', error);
      setOrders((data as OrderRow[]) ?? []);
      setLoading(false);
    };

    load();
  }, [user, authLoading]);

  return (
    <div className="min-h-screen bg-ry-white flex flex-col">
      <TopNav />
      <div className="pt-40 flex-1">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-ry-black mb-8">Your Orders</h1>

          {loading ? (
            <p className="text-gray-600">Loading your orders...</p>
          ) : orders.length === 0 ? (
            <RYCard className="p-10 text-center">
              <p className="text-xl text-gray-600 mb-6">You haven't placed any orders yet.</p>
              <Link to="/store">
                <RYButton variant="primary" size="lg">Browse the Store</RYButton>
              </Link>
            </RYCard>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <RYCard key={order.id} className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="font-bold text-ry-black">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-ry-black">${Number(order.total_amount).toFixed(2)}</p>
                      <p className="text-sm capitalize text-gray-600">
                        {order.payment_status === 'paid' ? order.status : order.payment_status}
                      </p>
                    </div>
                  </div>

                  <ul className="text-sm text-gray-700 space-y-1">
                    {order.order_items?.map((item) => (
                      <li key={item.id}>
                        {item.quantity}x {item.product_title}
                        {item.size ? ` — ${item.size}` : ''}
                        {item.color ? ` / ${item.color}` : ''}
                      </li>
                    ))}
                  </ul>

                  {order.tracking_number && (
                    <p className="mt-3 text-sm text-ry-black font-semibold">
                      Tracking: {order.tracking_number}
                    </p>
                  )}
                </RYCard>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
