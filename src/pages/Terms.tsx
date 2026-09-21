import React from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="pt-40 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <p>
            Welcome to Rendered Youth. By accessing or using our website and services, you agree to be bound by these Terms of Service.
          </p>
          <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By using Rendered Youth, you agree to comply with and be legally bound by these terms. If you do not agree, please do not use our services.
          </p>
          <h2 className="text-2xl font-semibold text-foreground">2. Use of Service</h2>
          <p>
            Rendered Youth provides a platform where young creators can upload original artwork to be rendered onto merchandise. Users must comply with all applicable laws and regulations.
          </p>
          <h2 className="text-2xl font-semibold text-foreground">3. Intellectual Property</h2>
          <p>
            Creators retain ownership of their original artwork. By uploading designs, creators grant Rendered Youth a license to reproduce their artwork on merchandise sold through our platform.
          </p>
          <h2 className="text-2xl font-semibold text-foreground">4. Age Requirements</h2>
          <p>
            Users under 13 require verified parental consent. Users between 13-17 may use the platform with parental awareness. Full terms regarding minors are available upon request.
          </p>
          <h2 className="text-2xl font-semibold text-foreground">5. Contact</h2>
          <p>
            For questions about these terms, please contact us through our contact page.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
