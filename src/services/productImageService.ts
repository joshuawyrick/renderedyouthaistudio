
import { supabase } from '@/integrations/supabase/client';

export interface ProductImage {
  id?: string;
  url: string;
  altText: string;
  sortOrder: number;
}

// We'll store images in the products table as a JSON array for now
// In the future, this could be moved to a dedicated product_images table

export const fetchProductImages = async (productId: string): Promise<ProductImage[]> => {
  try {
    // Get the main design image from the product and any additional images
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        additional_images,
        designs (
          file_url,
          title
        )
      `)
      .eq('id', productId)
      .single();

    if (error) throw error;

    const images: ProductImage[] = [];
    
    // Add the main design image first (only if it exists)
    if (product?.designs?.file_url) {
      images.push({
        url: product.designs.file_url,
        altText: product.designs.title || 'Product image',
        sortOrder: 1
      });
    }

    // Add any additional images stored in the product
    if (product?.additional_images && Array.isArray(product.additional_images)) {
      const additionalImages = product.additional_images.map((img: any, index: number) => ({
        url: img.url || img,
        altText: img.altText || `Product image ${index + 2}`,
        sortOrder: index + 2
      }));
      images.push(...additionalImages);
    }

    return images.sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (error) {
    console.error('Error fetching product images:', error);
    return [];
  }
};

const isStorageUrl = (url: string): boolean => {
  return url.includes('supabase') && url.includes('storage');
};

const extractStoragePathFromUrl = (url: string): string | null => {
  try {
    // Extract the path after /storage/v1/object/public/{bucket}/
    const match = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting storage path:', error);
    return null;
  }
};

const deleteStorageFile = async (url: string): Promise<void> => {
  if (!isStorageUrl(url)) {
    return;
  }

  const filePath = extractStoragePathFromUrl(url);
  if (!filePath) {
    console.error('Could not extract file path from URL:', url);
    return;
  }

  try {
    const { error } = await supabase.storage
      .from('design-uploads')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file from storage:', error);
    }
  } catch (error) {
    console.error('Error during file deletion:', error);
  }
};

export const saveProductImages = async (productId: string, images: ProductImage[], previousImages: ProductImage[] = []): Promise<void> => {
  try {

    // Get current product data to check the main design
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('designs(file_url)')
      .eq('id', productId)
      .single();

    if (fetchError) throw fetchError;

    const currentMainDesignUrl = currentProduct?.designs?.file_url;

    // The first image in the array is now the main image
    const newMainImage = images[0];
    const additionalImages = images.slice(1).map((img, index) => ({
      url: img.url,
      altText: img.altText,
      sortOrder: index + 2 // Start from 2 since main image is 1
    }));


    // Find images that were removed (existed in previousImages but not in current images)
    const currentUrls = new Set(images.map(img => img.url));
    const removedImages = previousImages.filter(prevImg => !currentUrls.has(prevImg.url));

    // Delete removed images from storage
    for (const removedImage of removedImages) {
      await deleteStorageFile(removedImage.url);
    }

    // If the main image has changed, we need to handle the design update
    if (newMainImage && currentMainDesignUrl && newMainImage.url !== currentMainDesignUrl) {
      
      // Update the design with the new main image URL
      const { data: productData } = await supabase
        .from('products')
        .select('design_id')
        .eq('id', productId)
        .single();

      if (productData?.design_id) {
        const { error: designUpdateError } = await supabase
          .from('designs')
          .update({ file_url: newMainImage.url })
          .eq('id', productData.design_id);

        if (designUpdateError) {
          console.error('Error updating design file_url:', designUpdateError);
        }
      }

      // Delete the old main design file if it's different from any of the current images
      if (!currentUrls.has(currentMainDesignUrl)) {
        await deleteStorageFile(currentMainDesignUrl);
      }
    }

    // Update the product with new additional images
    const { error } = await supabase
      .from('products')
      .update({
        additional_images: additionalImages
      })
      .eq('id', productId);

    if (error) throw error;

  } catch (error) {
    console.error('Error saving product images:', error);
    throw error;
  }
};
