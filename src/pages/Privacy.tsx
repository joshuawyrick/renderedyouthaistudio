import React from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="pt-40 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
          <p>
            Rendered Youth is committed to protecting the privacy of our users, especially young creators. This policy explains how we collect, use, and safeguard your information.
          </p>
          <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
          <p>
            We collect information you provide during account creation, including name, email, age bracket, and state of residence. For minor users, we also collect parent/guardian email for consent purposes.
          </p>
          <h2 className="text-2xl font-semibold text-foreground">2. Children's Privacy (COPPA)</h2>
          <p>
            We comply with the Children's Online Privacy Protection Act (COPPA). We do not knowingly collect personal information from children under 13 without verified parental consent.
          </p>
          <h2 className="text-2xl font-semibold text-foreground">3. How We Use Information</h2>
          <p>
            Your information is used to operate the platform, process orders, distribute creator earnings, and communicate important updates about your account and designs.
          </p>
          <h2 className="text-2xl font-semibold text-foreground">4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. All data is encrypted in transit and at rest.
          </p>
          <h2 className="text-2xl font-semibold text-foreground">5. Contact</h2>
          <p>
            For privacy-related questions or to exercise your rights, please contact us through our contact page.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
