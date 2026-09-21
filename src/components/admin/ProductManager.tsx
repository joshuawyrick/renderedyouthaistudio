
import React, { useState } from 'react';
import { Package } from 'lucide-react';
import ProductCreationTab from './product/ProductCreationTab';
import ProductManagementTab from './product/ProductManagementTab';
import { useProductManager } from '@/hooks/useProductManager';

const ProductManager = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const {
    availableDesigns,
    products,
    loading,
    creating,
    createProduct,
    toggleProductStatus,
    fetchData
  } = useProductManager();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Package className="w-5 h-5" />
        <h2 className="text-2xl font-semibold text-ry-black">Product Management</h2>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'create'
                ? 'border-ry-yellow text-ry-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Create Products ({availableDesigns.length})
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manage'
                ? 'border-ry-yellow text-ry-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Products ({products.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'create' && (
        <ProductCreationTab
          availableDesigns={availableDesigns}
          creating={creating}
          onCreateProduct={createProduct}
          products={products}
          onProductDeleted={fetchData}
        />
      )}

      {activeTab === 'manage' && (
        <ProductManagementTab
          products={products}
          onToggleProductStatus={toggleProductStatus}
          onProductUpdated={fetchData}
        />
      )}
    </div>
  );
};

export default ProductManager;
