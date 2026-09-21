import React from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYButton } from '@/components/ui/ry-button';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="pt-40 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Have a question, feedback, or need help? We'd love to hear from you.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">General Inquiries</h2>
              <p className="text-muted-foreground">
                For general questions about Rendered Youth, partnerships, or press inquiries.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Creator Support</h2>
              <p className="text-muted-foreground">
                Need help with your creator account, uploads, or earnings? We're here to help.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Order Support</h2>
              <p className="text-muted-foreground">
                Questions about an order, shipping, or returns? Reach out and we'll get it sorted.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-8">
            <p className="text-muted-foreground text-center">
              Contact form coming soon. In the meantime, reach out to us via our social media channels.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
