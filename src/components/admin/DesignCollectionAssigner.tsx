
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useToast } from '@/components/ui/use-toast';
import { Tag, Save } from 'lucide-react';

interface Design {
  id: string;
  title: string;
  status: string;
  file_url: string;
  collection_id: string | null;
  subcollection_id: string | null;
  created_at: string;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface Subcollection {
  id: string;
  collection_id: string;
  name: string;
  slug: string;
}

const DesignCollectionAssigner = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [subcollections, setSubcollections] = useState<Subcollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch designs with published status
      const { data: designsData, error: designsError } = await supabase
        .from('designs')
        .select('id, title, status, file_url, collection_id, subcollection_id, created_at')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (designsError) throw designsError;

      // Fetch collections
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('collections')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('sort_order');

      if (collectionsError) throw collectionsError;

      // Fetch subcollections
      const { data: subcollectionsData, error: subcollectionsError } = await supabase
        .from('subcollections')
        .select('id, collection_id, name, slug')
        .eq('is_active', true)
        .order('sort_order');

      if (subcollectionsError) throw subcollectionsError;

      setDesigns(designsData || []);
      setCollections(collectionsData || []);
      setSubcollections(subcollectionsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateDesignCollection = async (
    designId: string, 
    collectionId: string | null, 
    subcollectionId: string | null
  ) => {
    setSaving(designId);
    try {
      const { error } = await supabase
        .from('designs')
        .update({ 
          collection_id: collectionId,
          subcollection_id: subcollectionId 
        })
        .eq('id', designId);

      if (error) throw error;

      setDesigns(prev => 
        prev.map(d => 
          d.id === designId 
            ? { ...d, collection_id: collectionId, subcollection_id: subcollectionId }
            : d
        )
      );

      toast({
        title: "Success",
        description: "Design collection updated",
      });
    } catch (error) {
      console.error('Error updating design:', error);
      toast({
        title: "Error",
        description: "Failed to update design collection",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const getAvailableSubcollections = (collectionId: string | null) => {
    if (!collectionId) return [];
    return subcollections.filter(sc => sc.collection_id === collectionId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading designs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Tag className="w-5 h-5" />
        <h2 className="text-2xl font-semibold text-ry-black">Assign Designs to Collections</h2>
      </div>

      <div className="grid gap-4">
        {designs.length === 0 ? (
          <RYCard className="p-8 text-center">
            <p className="text-gray-500">No published designs found</p>
          </RYCard>
        ) : (
          designs.map((design) => (
            <RYCard key={design.id} className="p-4">
              <div className="flex gap-4">
                {/* Design Preview */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img 
                    src={design.file_url} 
                    alt={design.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling!.textContent = '🎨';
                    }}
                  />
                  <span className="text-2xl hidden">🎨</span>
                </div>

                {/* Design Info & Controls */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <h3 className="font-medium">{design.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(design.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Collection
                    </label>
                    <select
                      value={design.collection_id || ''}
                      onChange={(e) => {
                        const collectionId = e.target.value || null;
                        updateDesignCollection(design.id, collectionId, null);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent text-sm"
                      disabled={saving === design.id}
                    >
                      <option value="">No Collection</option>
                      {collections.map((collection) => (
                        <option key={collection.id} value={collection.id}>
                          {collection.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcollection
                    </label>
                    <select
                      value={design.subcollection_id || ''}
                      onChange={(e) => {
                        const subcollectionId = e.target.value || null;
                        updateDesignCollection(design.id, design.collection_id, subcollectionId);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent text-sm"
                      disabled={!design.collection_id || saving === design.id}
                    >
                      <option value="">No Subcollection</option>
                      {getAvailableSubcollections(design.collection_id).map((subcollection) => (
                        <option key={subcollection.id} value={subcollection.id}>
                          {subcollection.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end">
                    {saving === design.id ? (
                      <div className="text-sm text-gray-500">Saving...</div>
                    ) : (
                      <div className="text-sm text-green-600">
                        {design.collection_id ? '✓ Assigned' : 'Unassigned'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </RYCard>
          ))
        )}
      </div>
    </div>
  );
};

export default DesignCollectionAssigner;
