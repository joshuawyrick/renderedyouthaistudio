
import React from 'react';
import { AgeFilterChips } from '@/components/ui/age-filter-chips';
import { StateSelect } from '@/components/ui/state-select';
import { Search, Filter } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface StoreFiltersProps {
  selectedAge: string | undefined;
  setSelectedAge: (age: string | undefined) => void;
  selectedState: string | undefined;
  setSelectedState: (state: string | undefined) => void;
  selectedCollection: string | undefined;
  setSelectedCollection: (collection: string | undefined) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  collections: Collection[];
}

const StoreFilters: React.FC<StoreFiltersProps> = ({
  selectedAge,
  setSelectedAge,
  selectedState,
  setSelectedState,
  selectedCollection,
  setSelectedCollection,
  searchTerm,
  setSearchTerm,
  collections
}) => {
  const clearAllFilters = () => {
    setSelectedAge(undefined);
    setSelectedState(undefined);
    setSelectedCollection(undefined);
    setSearchTerm('');
  };

  const hasActiveFilters = selectedAge || selectedState || selectedCollection || searchTerm;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-ry-black" />
          <h2 className="text-lg font-semibold text-ry-black">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-ry-black transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-ry-black mb-3">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search designs or creators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Collection Filter */}
      <div>
        <label className="block text-sm font-medium text-ry-black mb-3">
          Collection
        </label>
        <select
          value={selectedCollection || ''}
          onChange={(e) => setSelectedCollection(e.target.value || undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent text-sm"
        >
          <option value="">All Collections</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name}
            </option>
          ))}
        </select>
      </div>

      {/* Age Filter */}
      <div>
        <label className="block text-sm font-medium text-ry-black mb-3">
          Creator Age
        </label>
        <AgeFilterChips
          selectedAge={selectedAge}
          onAgeChange={setSelectedAge}
          className="flex-col gap-2"
        />
      </div>

      {/* State Filter */}
      <div>
        <label className="block text-sm font-medium text-ry-black mb-3">
          Creator State
        </label>
        <StateSelect
          selected={selectedState}
          onChange={setSelectedState}
        />
      </div>
    </div>
  );
};

export default StoreFilters;
