
import React from 'react';
import { Filter, X } from 'lucide-react';
import { AgeFilterChips } from '@/components/ui/age-filter-chips';
import { StateSelect } from '@/components/ui/state-select';
import { Search } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface MobileStoreFiltersProps {
  selectedAge: string | undefined;
  setSelectedAge: (age: string | undefined) => void;
  selectedState: string | undefined;
  setSelectedState: (state: string | undefined) => void;
  selectedCollection: string | undefined;
  setSelectedCollection: (collection: string | undefined) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  collections: Collection[];
  activeFiltersCount: number;
}

const MobileStoreFilters: React.FC<MobileStoreFiltersProps> = ({
  selectedAge,
  setSelectedAge,
  selectedState,
  setSelectedState,
  selectedCollection,
  setSelectedCollection,
  searchTerm,
  setSearchTerm,
  collections,
  activeFiltersCount
}) => {
  const clearAllFilters = () => {
    setSelectedAge(undefined);
    setSelectedState(undefined);
    setSelectedCollection(undefined);
    setSearchTerm('');
  };

  const hasActiveFilters = selectedAge || selectedState || selectedCollection || searchTerm;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-ry-yellow text-ry-black px-2 py-0.5 rounded-full text-xs font-semibold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Filters</span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-ry-black transition-colors"
              >
                Clear all
              </button>
            )}
          </SheetTitle>
          <SheetDescription>
            Filter products by search, collection, creator age, and state
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent text-sm"
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
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent text-sm"
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
              className="grid grid-cols-2 gap-2"
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
      </SheetContent>
    </Sheet>
  );
};

export default MobileStoreFilters;
