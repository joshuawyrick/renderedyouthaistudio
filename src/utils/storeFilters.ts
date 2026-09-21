
interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  creatorName: string;
  creatorAge: string;
  creatorState: string;
  imageUrl?: string;
  collectionId?: string;
  design?: {
    file_url: string;
  };
  variants?: Array<{
    id: string;
    size: string;
    color: string;
    price_adjustment: number;
    is_available: boolean;
  }>;
}

export const filterProducts = (
  products: Product[],
  filters: {
    selectedAge?: string;
    selectedState?: string;
    selectedCollection?: string;
    searchTerm: string;
  }
) => {
  const { selectedAge, selectedState, selectedCollection, searchTerm } = filters;
  
  
  return products.filter(product => {
    // Age filter - match against creator age bracket
    const matchesAge = !selectedAge || product.creatorAge === selectedAge;
    
    // State filter - match against creator state
    const matchesState = !selectedState || product.creatorState === selectedState;
    
    // Collection filter - match against product collection ID
    const matchesCollection = !selectedCollection || product.collectionId === selectedCollection;
    
    // Search filter - search in title and creator name (case insensitive)
    const matchesSearch = !searchTerm || 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.creatorName.toLowerCase().includes(searchTerm.toLowerCase());

    const passes = matchesAge && matchesState && matchesCollection && matchesSearch;    
    return passes;
  });
};
