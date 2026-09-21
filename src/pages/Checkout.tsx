import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useSeo } from '@/hooks/useSeo';

const Checkout = () => {
  const { items, subtotal } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [form, setForm] = useState({
    email: user?.email ?? '',
    name: '',
    line1: '',
    city: '',
    state: '',
    postalCode: '',
  });

  useSeo({
    title: 'Checkout | Rendered Youth',
    description: 'Securely complete your Rendered Youth order.',
    noIndex: true,
  });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          email: form.email.trim(),
          name: form.name.trim(),
          discountCode: discountCode.trim() || null,
          shippingAddress: {
            line1: form.line1,
            city: form.city,
            state: form.state,
            postal_code: form.postalCode,
            country: 'US',
          },
          successUrl: `${window.location.origin}/order-confirmation`,
          cancelUrl: `${window.location.origin}/cart`,
        },
      });

      const message = (data as any)?.error ?? error?.message;
      if (message || !(data as any)?.url) {
        toast({
          title: 'Checkout unavailable',
          description: message ?? 'We could not start checkout. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      window.location.href = (data as any).url;
    } catch (err) {
      toast({
        title: 'Something went wrong',
        description: 'We could not reach the payment service. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ry-white flex flex-col">
        <TopNav />
        <div className="pt-40 flex-1">
          <main className="max-w-2xl mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold text-ry-black mb-4">Checkout</h1>
            <p className="text-gray-600 mb-8">Your cart is empty.</p>
            <Link to="/store">
              <RYButton variant="primary" size="lg">Browse the Store</RYButton>
            </Link>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ry-white flex flex-col">
      <TopNav />
      <div className="pt-40 flex-1">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-ry-black mb-8">Checkout</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <RYCard className="lg:col-span-2 p-6 space-y-5">
              <h2 className="text-xl font-bold text-ry-black">Where should we send it?</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={form.email} onChange={update('email')} />
                </div>
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" required value={form.name} onChange={update('name')} />
                </div>
              </div>

              <div>
                <Label htmlFor="line1">Street address</Label>
                <Input id="line1" required value={form.line1} onChange={update('line1')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required value={form.city} onChange={update('city')} />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" required value={form.state} onChange={update('state')} />
                </div>
                <div>
                  <Label htmlFor="postalCode">ZIP code</Label>
                  <Input id="postalCode" required value={form.postalCode} onChange={update('postalCode')} />
                </div>
              </div>

              <div>
                <Label htmlFor="discount">Discount code (optional)</Label>
                <Input
                  id="discount"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME10"
                />
              </div>
            </RYCard>

            <RYCard className="lg:col-span-1 p-6 space-y-4 lg:sticky lg:top-40 h-fit">
              <h2 className="text-xl font-bold text-ry-black">Order Summary</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                {items.map((item) => (
                  <li key={`${item.productId}-${item.variantId ?? 'base'}`} className="flex justify-between gap-3">
                    <span className="truncate">
                      {item.quantity}x {item.title} ({item.size})
                    </span>
                    <span className="font-semibold whitespace-nowrap">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between border-t border-gray-200 pt-3 font-bold text-ry-black">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500">
                Any discount is confirmed on the secure payment page.
              </p>

              <RYButton type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
                {submitting ? 'Starting secure checkout...' : 'Pay Securely'}
              </RYButton>
              <RYButton
                type="button"
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => navigate('/cart')}
              >
                Back to Cart
              </RYButton>
            </RYCard>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
