import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Order } from '../types';

const STORAGE_KEYS = {
  FAVORITES: '@miette_favorites_v1',
  CART: '@miette_cart_v1',
  ORDERS: '@miette_orders_v1',
  USER_PREFERENCES: '@miette_user_prefs_v1',
  MOCK_API_URL: '@miette_mockapi_endpoint_v1',
};

/**
 * Service to manage local persistence using AsyncStorage (MMA301 Requirement)
 */
export const StorageService = {
  // ===================== FAVORITES (Task 3) =====================

  /**
   * Get list of favorite product IDs or full products from AsyncStorage
   */
  async getFavorites(): Promise<string[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (!json) return [];
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('[StorageService] Error loading favorites:', error);
      return [];
    }
  },

  /**
   * Save list of favorite IDs to AsyncStorage
   */
  async saveFavorites(favoriteIds: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favoriteIds));
    } catch (error) {
      console.warn('[StorageService] Error saving favorites:', error);
    }
  },

  /**
   * Toggle a favorite product ID
   */
  async toggleFavorite(productId: string): Promise<string[]> {
    const current = await this.getFavorites();
    const exists = current.includes(productId);
    const updated = exists
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    await this.saveFavorites(updated);
    return updated;
  },

  /**
   * Delete one favorite item
   */
  async removeFavorite(productId: string): Promise<string[]> {
    const current = await this.getFavorites();
    const updated = current.filter((id) => id !== productId);
    await this.saveFavorites(updated);
    return updated;
  },

  /**
   * Delete all favorites from device (MMA301 Requirement: Delete all their favorite from devices)
   */
  async clearAllFavorites(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.FAVORITES);
    } catch (error) {
      console.warn('[StorageService] Error clearing favorites:', error);
    }
  },

  // ===================== CART PERSISTENCE =====================

  async getCart(): Promise<CartItem[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.CART);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      console.warn('[StorageService] Error loading cart:', error);
      return [];
    }
  },

  async saveCart(cart: CartItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (error) {
      console.warn('[StorageService] Error saving cart:', error);
    }
  },

  // ===================== ORDERS PERSISTENCE =====================

  async getOrders(): Promise<Order[] | null> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
      return json ? JSON.parse(json) : null;
    } catch (error) {
      console.warn('[StorageService] Error loading orders:', error);
      return null;
    }
  },

  async saveOrders(orders: Order[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (error) {
      console.warn('[StorageService] Error saving orders:', error);
    }
  },

  // ===================== MOCKAPI ENDPOINT CONFIG =====================

  async getMockApiUrl(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.MOCK_API_URL);
    } catch {
      return null;
    }
  },

  async setMockApiUrl(url: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MOCK_API_URL, url);
    } catch (error) {
      console.warn('[StorageService] Error saving MockAPI URL:', error);
    }
  },
};
