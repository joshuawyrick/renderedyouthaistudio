import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useCart } from '@/contexts/CartContext';
import { useSeo } from '@/hooks/useSeo';

const Cart = () => {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  useSeo({
    title: 'Your Cart | Rendered Youth',
    description: 'Review the kid-designed apparel in your cart before checkout.',
    noIndex: true,
  });

  return (
    <div className="min-h-screen bg-ry-white flex flex-col">
      <TopNav />

      <div className="pt-40 flex-1">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-ry-black mb-8">Your Cart</h1>

          {items.length === 0 ? (
            <RYCard className="p-10 text-center">
              <p className="text-xl text-gray-600 mb-6">Your cart is empty.</p>
              <Link to="/store">
                <RYButton variant="primary" size="lg">Browse the Store</RYButton>
              </Link>
            </RYCard>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <RYCard key={`${item.productId}-${item.variantId ?? 'base'}`} className="p-4">
                    <div className="flex gap-4">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                          className="w-24 h-24 object-contain bg-gray-50 rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-ry-black truncate">{item.title}</h2>
                        <p className="text-sm text-gray-600">
                          {item.size} · {item.color}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          ${Number(item.unitPrice).toFixed(2)} each
                        </p>

                        <div className="flex items-center justify-between mt-3 gap-3">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              className="p-2 text-ry-black hover:bg-gray-100"
                              onClick={() =>
                                updateQuantity(item.productId, item.variantId, item.quantity - 1)
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 font-semibold">{item.quantity}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              className="p-2 text-ry-black hover:bg-gray-100"
                              onClick={() =>
                                updateQuantity(item.productId, item.variantId, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-bold text-ry-black">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </span>
                            <button
                              type="button"
                              aria-label={`Remove ${item.title}`}
                              className="text-gray-500 hover:text-red-600"
                              onClick={() => removeItem(item.productId, item.variantId)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RYCard>
                ))}
              </div>

              <div className="lg:col-span-1">
                <RYCard className="p-6 space-y-4 lg:sticky lg:top-40">
                  <h2 className="text-xl font-bold text-ry-black">Summary</h2>
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Shipping, tax and any discount code are applied at checkout.
                  </p>
                  <Link to="/checkout" className="block">
                    <RYButton variant="primary" size="lg" className="w-full">
                      Checkout
                    </RYButton>
                  </Link>
                  <Link to="/store" className="block">
                    <RYButton variant="secondary" size="lg" className="w-full">
                      Keep Shopping
                    </RYButton>
                  </Link>
                </RYCard>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
