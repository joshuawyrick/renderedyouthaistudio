import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import CollectionEditDialog from './CollectionEditDialog';
import NavigationSettings from './NavigationSettings';

interface Collection {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  is_active: boolean;
  sort_order: number;
  page_header: string | null;
  page_description: string | null;
  created_at: string;
}

interface Subcollection {
  id: string;
  collection_id: string;
  name: string;
  description: string | null;
  slug: string;
  is_active: boolean;
  sort_order: number;
}

const CollectionManager = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [subcollections, setSubcollections] = useState<Subcollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deletingSubcollection, setDeletingSubcollection] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    if (selectedCollection) {
      fetchSubcollections(selectedCollection);
    }
  }, [selectedCollection]);

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast({
        title: "Error",
        description: "Failed to load collections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcollections = async (collectionId: string) => {
    try {
      const { data, error } = await supabase
        .from('subcollections')
        .select('*')
        .eq('collection_id', collectionId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setSubcollections(data || []);
    } catch (error) {
      console.error('Error fetching subcollections:', error);
      toast({
        title: "Error",
        description: "Failed to load subcollections",
        variant: "destructive",
      });
    }
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setEditDialogOpen(true);
  };

  const handleEditDialogUpdate = () => {
    fetchCollections();
  };

  const handleDeleteSubcollection = async (subcollectionId: string) => {
    setDeletingSubcollection(subcollectionId);
    
    try {
      const { error } = await supabase
        .from('subcollections')
        .delete()
        .eq('id', subcollectionId);

      if (error) throw error;

      // Remove from local state
      setSubcollections(prev => prev.filter(sc => sc.id !== subcollectionId));
      
      toast({
        title: "Success",
        description: "Subcollection deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting subcollection:', error);
      toast({
        title: "Error",
        description: "Failed to delete subcollection",
        variant: "destructive",
      });
    } finally {
      setDeletingSubcollection(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading collections...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-ry-black">Collection Management</h2>
        <RYButton variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          New Collection
        </RYButton>
      </div>

      {/* Navigation Settings */}
      <NavigationSettings />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collections List */}
        <RYCard className="p-6">
          <h3 className="text-lg font-medium mb-4">Collections</h3>
          <div className="space-y-3">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedCollection === collection.id
                    ? 'border-ry-yellow bg-ry-yellow/10'
                    : 'border-gray-200 hover:border-gray-300'
                } ${!collection.is_active ? 'opacity-50' : ''}`}
                onClick={() => setSelectedCollection(collection.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-gray-500" />
                      <h4 className="font-medium">{collection.name}</h4>
                      {!collection.is_active && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Hidden
                        </span>
                      )}
                      {collection.is_active && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                          Visible in Nav
                        </span>
                      )}
                    </div>
                    {collection.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {collection.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCollection(collection);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </RYCard>

        {/* Subcollections List */}
        <RYCard className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {selectedCollection 
                ? `Subcollections - ${collections.find(c => c.id === selectedCollection)?.name}`
                : 'Subcollections'
              }
            </h3>
            {selectedCollection && (
              <RYButton variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Subcollection
              </RYButton>
            )}
          </div>

          {!selectedCollection ? (
            <div className="text-center py-8 text-gray-500">
              Select a collection to view subcollections
            </div>
          ) : (
            <div className="space-y-3">
              {subcollections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No subcollections found
                </div>
              ) : (
                subcollections.map((subcollection) => (
                  <div
                    key={subcollection.id}
                    className={`p-3 border rounded-lg ${
                      subcollection.is_active 
                        ? 'border-gray-200' 
                        : 'border-gray-200 opacity-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{subcollection.name}</h4>
                          {!subcollection.is_active && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                        {subcollection.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {subcollection.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteSubcollection(subcollection.id)}
                          disabled={deletingSubcollection === subcollection.id}
                          className="p-1 hover:bg-gray-100 rounded text-red-600 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </RYCard>
      </div>

      <CollectionEditDialog
        collection={editingCollection}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdate={handleEditDialogUpdate}
      />
    </div>
  );
};

export default CollectionManager;
