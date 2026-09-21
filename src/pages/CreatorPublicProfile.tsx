
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { User, Instagram, Facebook } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface CreatorData {
  id: string;
  first_name: string;
  last_name: string;
  age_bracket: string;
  bio: string;
  profile_image_url: string | null;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  facebook_handle: string | null;
}

interface DesignData {
  id: string;
  title: string;
  file_url: string;
  inspiration: string;
  status: string;
  created_at: string;
  products: Array<{
    id: string;
    title: string;
    price: number;
    status: string;
  }>;
}

const CreatorPublicProfile = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const { toast } = useToast();
  const [creator, setCreator] = useState<CreatorData | null>(null);
  const [designs, setDesigns] = useState<DesignData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (creatorId) {
      loadCreatorData();
    }
  }, [creatorId]);

  const loadCreatorData = async () => {
    try {
      // Load creator profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, age_bracket, bio, profile_image_url, instagram_handle, tiktok_handle, facebook_handle')
        .eq('id', creatorId)
        .single();

      if (profileError) throw profileError;
      
      // Transform the data to match our interface
      const creatorData: CreatorData = {
        id: profile.id,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        age_bracket: profile.age_bracket || '',
        bio: profile.bio || '',
        profile_image_url: profile.profile_image_url,
        instagram_handle: profile.instagram_handle,
        tiktok_handle: profile.tiktok_handle,
        facebook_handle: profile.facebook_handle
      };
      
      setCreator(creatorData);

      // Load creator's designs and products
      const { data: designsData, error: designsError } = await supabase
        .from('designs')
        .select(`
          id,
          title,
          file_url,
          inspiration,
          status,
          created_at,
          products (
            id,
            title,
            price,
            status
          )
        `)
        .eq('user_id', creatorId)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (designsError) throw designsError;
      setDesigns(designsData || []);

    } catch (error) {
      console.error('Error loading creator data:', error);
      toast({
        title: "Error",
        description: "Creator not found",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-40 flex items-center justify-center min-h-screen">
          <div className="text-2xl text-ry-black">Loading...</div>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-ry-white">
        <TopNav />
        <div className="pt-40 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-ry-black mb-4">Creator Not Found</h1>
            <p className="text-gray-600">The creator you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      <div className="pt-40">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Creator Header */}
          <div className="text-center mb-12">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-ry-yellow overflow-hidden mx-auto mb-6">
              {creator.profile_image_url ? (
                <img 
                  src={creator.profile_image_url} 
                  alt={`${creator.first_name}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-16 w-16 text-gray-400" />
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-ry-black mb-2">
              {creator.first_name}
            </h1>
            
            <p className="text-xl text-ry-yellow font-semibold mb-4">
              Age {creator.age_bracket}
            </p>
            
            {creator.bio && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                {creator.bio}
              </p>
            )}

            {/* Social Links */}
            <div className="flex justify-center space-x-4">
              {creator.instagram_handle && (
                <a
                  href={`https://instagram.com/${creator.instagram_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-pink-100 rounded-full hover:bg-pink-200 transition-colors"
                >
                  <Instagram className="h-6 w-6 text-pink-600" />
                </a>
              )}
              
              {creator.tiktok_handle && (
                <a
                  href={`https://tiktok.com/@${creator.tiktok_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-black rounded-full hover:bg-gray-800 transition-colors"
                >
                  <div className="h-6 w-6 text-white font-bold text-sm flex items-center justify-center">
                    T
                  </div>
                </a>
              )}
              
              {creator.facebook_handle && (
                <a
                  href={`https://facebook.com/${creator.facebook_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <Facebook className="h-6 w-6 text-blue-600" />
                </a>
              )}
            </div>
          </div>

          {/* Artwork Gallery */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-ry-black text-center mb-8">
              {creator.first_name}'s Artwork
            </h2>
            
            {designs.length === 0 ? (
              <div className="text-center text-gray-600">
                <p className="text-lg">No published artwork yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {designs.map((design) => (
                  <RYCard key={design.id} className="overflow-hidden">
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={design.file_url}
                        alt={design.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-ry-black mb-2">
                        {design.title}
                      </h3>
                      
                      {design.inspiration && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            What inspired this:
                          </p>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {design.inspiration}
                          </p>
                        </div>
                      )}
                      
                      {design.products && design.products.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">
                            Available products:
                          </p>
                          {design.products
                            .filter(product => product.status === 'active')
                            .map((product) => (
                            <div key={product.id} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                {product.title}
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-semibold text-ry-black">
                                  ${product.price}
                                </span>
                                <RYButton 
                                  size="sm" 
                                  variant="primary"
                                  onClick={() => window.location.href = `/product/${product.id}`}
                                >
                                  Buy
                                </RYButton>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </RYCard>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CreatorPublicProfile;
