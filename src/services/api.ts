import { PRODUCTS } from '../data/mockData';
import { Product } from '../types';
import { StorageService } from './storageService';

// Default mockapi.io template URL (can be customized by teacher/student in Settings)
export const DEFAULT_MOCKAPI_URL = 'https://67bc82c0ed4861e07b36fdb3.mockapi.io/api/v1';

export interface FilterSortOptions {
  category?: string;
  brand?: string;
  gender?: boolean; // true = Nữ/Unisex, false = Nam
  sortBy?: 'price_desc' | 'price_asc' | 'rating' | 'popular';
  searchQuery?: string;
}

/**
 * Backend API service supporting both MockAPI.io and Offline fallback
 * (Conforms to MMA301 Task 1 & Task 3 specifications)
 */
export const ApiService = {
  /**
   * Fetch all products from MockAPI with fallback
   */
  async getProducts(options?: FilterSortOptions): Promise<Product[]> {
    let products: Product[] = [];
    const customUrl = await StorageService.getMockApiUrl();
    const endpoint = (customUrl || DEFAULT_MOCKAPI_URL) + '/products';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for fast UI

      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          products = data;
        } else {
          products = PRODUCTS;
        }
      } else {
        products = PRODUCTS;
      }
    } catch {
      // Offline fallback: Use enriched mockData
      products = PRODUCTS;
    }

    // Apply Client-side Filtering & Sorting as specified in MMA301 Assignment
    return this.applyFilterAndSort(products, options);
  },

  /**
   * Filter and Sort products according to MMA301 rubric
   */
  applyFilterAndSort(products: Product[], options?: FilterSortOptions): Product[] {
    let result = [...products];

    if (!options) return result;

    // Filter by category
    if (options.category && options.category !== 'all') {
      result = result.filter((p) => p.categoryId === options.category);
    }

    // Filter by brand
    if (options.brand && options.brand !== 'all') {
      result = result.filter(
        (p) => p.brand?.toLowerCase() === options.brand?.toLowerCase()
      );
    }

    // Filter by gender (if specified)
    if (options.gender !== undefined) {
      result = result.filter((p) => p.gender === options.gender);
    }

    // Search query
    if (options.searchQuery && options.searchQuery.trim().length > 0) {
      const q = options.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }

    // Sắp xếp theo yêu cầu đề bài:
    // "The handbag list should be displayed in descending order by cost"
    if (options.sortBy === 'price_desc') {
      result.sort((a, b) => {
        const priceA = a.variants[0]?.price || 0;
        const priceB = b.variants[0]?.price || 0;
        return priceB - priceA; // Descending
      });
    } else if (options.sortBy === 'price_asc') {
      result.sort((a, b) => {
        const priceA = a.variants[0]?.price || 0;
        const priceB = b.variants[0]?.price || 0;
        return priceA - priceB; // Ascending
      });
    } else if (options.sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (options.sortBy === 'popular') {
      result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    return result;
  },

  /**
   * Fetch single product details with ratings & reviews
   */
  async getProductById(id: string): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find((p) => p.id === id);
  },
};
