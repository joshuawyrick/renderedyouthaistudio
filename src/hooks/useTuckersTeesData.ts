
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { fetchTuckersData } from '@/services/tuckersTeesService';
import type { Design, Collection } from '@/types/tuckersTeesTypes';

export const useTuckersTeesData = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [tuckersDesigns, setTuckersDesigns] = useState<Design[]>([]);
  const [tuckersCollection, setTuckersCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      const { designsWithProfiles, collection } = await fetchTuckersData();

      if (collection) {
        setTuckersCollection(collection);
        
        const tuckersDesigns = designsWithProfiles.filter(d => d.collection_id === collection.id);
        const otherDesigns = designsWithProfiles.filter(d => d.collection_id !== collection.id);
        
        setTuckersDesigns(tuckersDesigns);
        setDesigns(otherDesigns);
      } else {
        setDesigns(designsWithProfiles);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load designs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    designs,
    setDesigns,
    tuckersDesigns,
    setTuckersDesigns,
    tuckersCollection,
    loading,
    toast
  };
};
