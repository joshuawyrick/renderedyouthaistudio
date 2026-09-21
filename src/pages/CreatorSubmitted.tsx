
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { fetchAiStatus, AiStatus } from '@/services/mockupGenerationService';
import { CheckCircle, Upload, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';

const POLL_INTERVAL_MS = 4000;
const MAX_POLLS = 45; // ~3 minutes

const CreatorSubmitted = () => {
  const [searchParams] = useSearchParams();
  const designId = searchParams.get('design');
  const [status, setStatus] = useState<AiStatus>('pending');
  const [polls, setPolls] = useState(0);

  useEffect(() => {
    if (!designId) return;
    if (status === 'ready' || status === 'failed') return;
    if (polls >= MAX_POLLS) return;

    const timer = setTimeout(async () => {
      const result = await fetchAiStatus(designId);
      if (result) setStatus(result.status);
      setPolls((n) => n + 1);
    }, polls === 0 ? 1500 : POLL_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [designId, status, polls]);

  const stillWorking = designId && status !== 'ready' && status !== 'failed' && polls < MAX_POLLS;

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />

      <div className="pt-40">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <RYCard className="p-12 max-w-2xl mx-auto">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-20 w-20 text-green-500" />
              </div>

              {/* Header */}
              <h1 className="text-4xl md:text-5xl font-bold text-ry-black mb-6">
                Submission Received!
              </h1>

              <p className="text-xl text-gray-600 mb-8">
                We got your artwork! We're turning it into shirt designs for you to choose from.
              </p>

              {/* Live AI generation state */}
              {designId && (
                <div className="mb-8">
                  {stillWorking && (
                    <div className="flex items-center justify-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-5">
                      <Loader2 className="h-6 w-6 text-ry-black animate-spin" />
                      <span className="text-lg font-medium text-ry-black">
                        Creating your designs... this takes about a minute.
                      </span>
                    </div>
                  )}

                  {status === 'ready' && (
                    <div className="bg-ry-yellow/20 border-2 border-ry-yellow rounded-lg p-6">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles className="h-6 w-6 text-ry-black" />
                        <span className="text-xl font-bold text-ry-black">
                          Your designs are ready!
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">
                        Pick your favorite and we'll put it on a shirt.
                      </p>
                      <RYButton
                        variant="primary"
                        size="lg"
                        onClick={() => {
                          window.location.href = `/design-review?design=${designId}`;
                        }}
                      >
                        Choose Your Design
                      </RYButton>
                    </div>
                  )}

                  {(status === 'failed' || (!stillWorking && status !== 'ready')) && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                      <p className="text-gray-700">
                        Our team is finishing your designs by hand. We'll email you as soon
                        as they're ready to pick.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Next Steps */}
              <div className="text-left mb-8">
                <h2 className="text-lg font-semibold text-ry-black mb-4">What happens next?</h2>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-ry-yellow text-ry-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                    <p className="text-gray-600">We turn your drawing into 4 shirt designs</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-ry-yellow text-ry-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                    <p className="text-gray-600">You choose your favorite one</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-ry-yellow text-ry-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                    <p className="text-gray-600">Our team gives it a final review</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-ry-yellow text-ry-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">4</div>
                    <p className="text-gray-600">Your design goes live in our store - and you start earning!</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <RYButton
                  variant="primary"
                  size="lg"
                  onClick={() => window.location.href = '/creator/dashboard'}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </RYButton>
                <RYButton
                  variant="secondary"
                  size="lg"
                  onClick={() => window.location.href = '/creator/upload'}
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Another
                </RYButton>
              </div>
            </RYCard>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CreatorSubmitted;
