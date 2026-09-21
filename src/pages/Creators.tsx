
import React, { useState, useEffect } from 'react';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import { AgeFilterChips } from '@/components/ui/age-filter-chips';
import { CreatorCard } from '@/components/ui/creator-card';
import { Search } from 'lucide-react';
import { fetchCreatorProfiles, type CreatorProfile } from '@/services/creatorService';

const Creators = () => {
  const [selectedAge, setSelectedAge] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCreators();
  }, []);

  const loadCreators = async () => {
    try {
      const creatorProfiles = await fetchCreatorProfiles();
      setCreators(creatorProfiles);
    } catch (error) {
      console.error('Error loading creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCreators = creators.filter(creator => {
    const matchesAge = !selectedAge || creator.ageBracket === selectedAge;
    const matchesSearch = !searchTerm || 
      creator.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAge && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-ry-white">
      <TopNav />
      
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-40">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-ry-black mb-6">
              Meet Our Young Artists
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover talented creators from across the country turning their imagination into wearable art
            </p>
          </div>

          {/* Filters */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Age Filter */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-ry-black mb-3">Filter by Age</h3>
                <AgeFilterChips
                  selectedAge={selectedAge}
                  onAgeChange={setSelectedAge}
                />
              </div>

              {/* Search */}
              <div className="flex-1 max-w-md">
                <h3 className="text-sm font-medium text-ry-black mb-3">Search Creators</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {filteredCreators.length} creator{filteredCreators.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64"></div>
                </div>
              ))}
            </div>
          ) : (
            /* Creators Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCreators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredCreators.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-ry-black mb-2">No creators found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Creators;
