
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useSeo } from '@/hooks/useSeo';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/components/ui/use-toast';
import { useProductDetail } from '@/hooks/useProductDetail';
import { fetchProductImages, type ProductImage } from '@/services/productImageService';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductOptions from '@/components/product/ProductOptions';
import ProductActions from '@/components/product/ProductActions';
import ProductDetails from '@/components/product/ProductDetails';
import DiscountCode from '@/components/product/DiscountCode';
import OrderSummary from '@/components/product/OrderSummary';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [variantAdjustment, setVariantAdjustment] = useState(0);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [discount, setDiscount] = useState<{ code: string; amount: number; type: 'percentage' | 'fixed' } | undefined>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const { product, loading } = useProductDetail(slug);

  useSeo({
    title: product ? `${product.title} | Rendered Youth` : 'Shop Kid-Designed Apparel | Rendered Youth',
    description: product
      ? `${product.title} — original artwork by a young creator, printed on premium apparel. Every purchase pays the artist a royalty.`
      : 'Original artwork by young creators, printed on premium apparel.',
    image: productImages[0]?.url,
    jsonLd: product
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.title,
          description: product.description ?? product.title,
          image: productImages.map((i) => i.url).filter(Boolean),
          brand: { '@type': 'Brand', name: 'Rendered Youth' },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: Number(product.base_price || product.price).toFixed(2),
            availability: 'https://schema.org/InStock',
            url: typeof window !== 'undefined' ? window.location.href : undefined,
          },
        }
      : undefined,
  });

  // Initialize size, color, and price when product loads
  useEffect(() => {
    if (product && product.product_variants.length > 0) {
      const firstAvailableVariant = product.product_variants.find(v => v.is_available);
      if (firstAvailableVariant) {
        setSelectedSize(firstAvailableVariant.size);
        setSelectedColor(firstAvailableVariant.color);
        setVariantAdjustment(firstAvailableVariant.price_adjustment);
      }
      setCurrentPrice(product.base_price || product.price);
    } else if (product) {
      // No variants, use base product
      setCurrentPrice(product.base_price || product.price);
      setSelectedSize('One Size');
      setSelectedColor('Default');
    }
  }, [product]);

  // Fetch product images when product loads
  useEffect(() => {
    if (product) {
      fetchProductImages(product.id).then(setProductImages);
    }
  }, [product]);

  const handlePriceChange = (basePrice: number, adjustment: number) => {
    setVariantAdjustment(adjustment);
  };

  const addSelectionToCart = (): boolean => {
    if (!product || !selectedSize || !selectedColor) {
      toast({
        title: "Please select options",
        description: "Please select size and color first",
        variant: "destructive",
      });
      return false;
    }

    const variant = product.product_variants.find(
      (v) => v.size === selectedSize && v.color === selectedColor,
    );

    if (product.product_variants.length > 0 && (!variant || !variant.is_available)) {
      toast({
        title: "Sold out",
        description: "That size and color combination isn't available right now.",
        variant: "destructive",
      });
      return false;
    }

    addItem({
      productId: product.id,
      variantId: variant?.id ?? null,
      title: product.title,
      size: selectedSize,
      color: selectedColor,
      unitPrice: (product.base_price || product.price) + (variant?.price_adjustment ?? 0),
      quantity: 1,
      imageUrl: productImages[0]?.url,
    });

    return true;
  };

  const handleAddToCart = () => {
    if (!addSelectionToCart()) return;
    toast({
      title: "Added to cart!",
      description: `${product?.title} in ${selectedSize} (${selectedColor}) is in your cart`,
    });
  };

  const handleBuyNow = () => {
    if (!addSelectionToCart()) return;
    navigate('/checkout');
  };

  const handleDiscountApplied = (discountInfo: { code: string; amount: number; type: 'percentage' | 'fixed' }) => {
    setDiscount(discountInfo);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-40 flex items-center justify-center min-h-screen">
          <div className="text-2xl text-ry-black">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-40 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-ry-black mb-4">Product Not Found</h1>
            <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const finalPrice = currentPrice + variantAdjustment;

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-40">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Images */}
            <div className="lg:col-span-1">
              <ProductImageGallery 
                images={productImages}
                title={product.title}
              />
            </div>

            {/* Middle Column - Product Info */}
            <div className="lg:col-span-1 space-y-6">
              <ProductInfo product={product} />
              
              <ProductOptions
                variants={product.product_variants}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onSizeChange={setSelectedSize}
                onColorChange={setSelectedColor}
                onPriceChange={handlePriceChange}
              />

              <ProductActions
                price={finalPrice}
                productTitle={product.title}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />

              <ProductDetails product={product} />
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1 space-y-6">
              <OrderSummary
                basePrice={currentPrice}
                variantAdjustment={variantAdjustment}
                discount={discount}
                shipping={0} // Free shipping for now
                tax={0} // Tax calculation can be added later
              />
              
              <DiscountCode onDiscountApplied={handleDiscountApplied} />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
