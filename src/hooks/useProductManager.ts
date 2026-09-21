
import { useProductData } from './useProductData';
import { useProductActions } from './useProductActions';

export const useProductManager = () => {
  const {
    availableDesigns,
    products,
    loading,
    fetchData,
    setProducts
  } = useProductData();

  const {
    creating,
    createProduct,
    toggleProductStatus
  } = useProductActions(fetchData, setProducts);

  return {
    availableDesigns,
    products,
    loading,
    creating,
    createProduct,
    toggleProductStatus,
    fetchData
  };
};
