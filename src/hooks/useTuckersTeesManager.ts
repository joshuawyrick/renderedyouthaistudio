
import { useState } from 'react';
import { useTuckersTeesData } from './useTuckersTeesData';
import { assignDesignToTuckers, removeDesignFromTuckers } from '@/services/tuckersTeesService';

export const useTuckersTeesManager = () => {
  const {
    designs,
    setDesigns,
    tuckersDesigns,
    setTuckersDesigns,
    tuckersCollection,
    loading,
    toast
  } = useTuckersTeesData();
  
  const [assigning, setAssigning] = useState<string | null>(null);

  const assignToTuckers = async (designId: string) => {
    if (!tuckersCollection) return;

    setAssigning(designId);
    try {
      await assignDesignToTuckers(designId, tuckersCollection.id);

      const designToMove = designs.find(d => d.id === designId);
      if (designToMove) {
        setDesigns(prev => prev.filter(d => d.id !== designId));
        setTuckersDesigns(prev => [...prev, { ...designToMove, collection_id: tuckersCollection.id }]);
      }

      toast({
        title: "Success",
        description: "Design added to Tucker's Tees collection",
      });
    } catch (error) {
      console.error('Error assigning design:', error);
      toast({
        title: "Error",
        description: "Failed to assign design to Tucker's collection",
        variant: "destructive",
      });
    } finally {
      setAssigning(null);
    }
  };

  const removeFromTuckers = async (designId: string) => {
    setAssigning(designId);
    try {
      await removeDesignFromTuckers(designId);

      const designToMove = tuckersDesigns.find(d => d.id === designId);
      if (designToMove) {
        setTuckersDesigns(prev => prev.filter(d => d.id !== designId));
        setDesigns(prev => [...prev, { ...designToMove, collection_id: null }]);
      }

      toast({
        title: "Success",
        description: "Design removed from Tucker's Tees collection",
      });
    } catch (error) {
      console.error('Error removing design:', error);
      toast({
        title: "Error",
        description: "Failed to remove design from Tucker's collection",
        variant: "destructive",
      });
    } finally {
      setAssigning(null);
    }
  };

  return {
    designs,
    tuckersDesigns,
    tuckersCollection,
    loading,
    assigning,
    assignToTuckers,
    removeFromTuckers
  };
};
