
import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Studio, { StudioProvider } from './features/studio/Studio';
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Eagerly load the landing page for fast first paint
import Index from "./pages/Index";

// Lazy load all other pages
const Store = lazy(() => import("./pages/Store"));
const Collection = lazy(() => import("./pages/Collection"));
const Creators = lazy(() => import("./pages/Creators"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const About = lazy(() => import("./pages/About"));
const TrainingProgram = lazy(() => import("./pages/TrainingProgram"));
const CreatorPublicProfile = lazy(() => import("./pages/CreatorPublicProfile"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Contact = lazy(() => import("./pages/Contact"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const Orders = lazy(() => import("./pages/Orders"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <CartProvider>
        <StudioProvider><Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/store" element={<Store />} />
            <Route path="/store/:slug" element={<ProductDetail />} />
            <Route path="/collections/:slug" element={<Collection />} />
            <Route path="/age-verification" element={<Navigate to="/onboarding/parent" replace />} />
            <Route path="/creators" element={<Creators />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/training-program" element={<TrainingProgram />} />
            <Route path="/admin/*" element={<Studio />} />
            <Route path="/start" element={<Studio />} />
            <Route path="/onboarding/*" element={<Studio />} />
            <Route path="/parent/*" element={<Studio />} />
            <Route path="/creator/*" element={<Studio />} />
            <Route path="/schools" element={<Studio />} />
            <Route path="/creators/:creatorId" element={<CreatorPublicProfile />} />
            <Route path="/parent-verify" element={<Navigate to="/onboarding/parent" replace />} />
            <Route path="/design-review" element={<Navigate to="/parent/designs" replace />} />
            <Route path="/auth" element={<Navigate to="/start" replace />} />
            <Route path="/auth/*" element={<Navigate to="/start" replace />} />
            <Route path="/sign-in" element={<Navigate to="/start" replace />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense></StudioProvider>
        </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
