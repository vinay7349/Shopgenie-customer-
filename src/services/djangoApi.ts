import { Shop, Product, Offer, Order, LoyaltyCard, FeedPost } from '../types';

const DJANGO_BASE_URL = import.meta.env.VITE_DJANGO_API_URL || '/api';

export interface DjangoHealthStatus {
  online: boolean;
  message: string;
  url: string;
  version?: string;
}

class DjangoApiService {
  private baseUrl: string;
  private isOnlineCached: boolean | null = null;
  private lastCheckTime: number = 0;

  constructor() {
    this.baseUrl = DJANGO_BASE_URL.replace(/\/$/, '');
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Checks if Django REST API is running and reachable
   */
  async checkHealth(): Promise<DjangoHealthStatus> {
    const now = Date.now();
    // Cache check for 10 seconds to avoid spamming
    if (this.isOnlineCached !== null && now - this.lastCheckTime < 10000) {
      return {
        online: this.isOnlineCached,
        message: this.isOnlineCached ? 'Connected to Django Backend' : 'Django server offline (using fallback)',
        url: this.baseUrl
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      // Check root API endpoint
      const res = await fetch(`${this.baseUrl}/`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        this.isOnlineCached = true;
        this.lastCheckTime = now;
        return {
          online: true,
          message: data.service || 'Connected to Django REST API',
          url: this.baseUrl,
          version: data.version
        };
      }
    } catch {
      // Server not reachable
    }

    this.isOnlineCached = false;
    this.lastCheckTime = now;
    return {
      online: false,
      message: 'Django REST API offline (http://localhost:8000)',
      url: this.baseUrl
    };
  }

  /**
   * Fetch all shops with optional filtering
   */
  async getShops(params?: { category?: string; area?: string; search?: string }): Promise<Shop[] | null> {
    if (this.isOnlineCached === false) return null;
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All') query.set('category', params.category);
      if (params?.area) query.set('area', params.area);
      if (params?.search) query.set('search', params.search);

      const res = await fetch(`${this.baseUrl}/shops/?${query.toString()}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Fetch products by shop or category
   */
  async getProducts(params?: { shopId?: string; category?: string; search?: string }): Promise<Product[] | null> {
    if (this.isOnlineCached === false) return null;
    try {
      const query = new URLSearchParams();
      if (params?.shopId) query.set('shop_id', params.shopId);
      if (params?.category && params.category !== 'All') query.set('category', params.category);
      if (params?.search) query.set('search', params.search);

      const res = await fetch(`${this.baseUrl}/products/?${query.toString()}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Barcode instant lookup in Django
   */
  async lookupBarcode(barcode: string, shopId?: string): Promise<{ found: boolean; product?: Product; message?: string }> {
    try {
      const query = new URLSearchParams({ barcode });
      if (shopId) query.set('shop_id', shopId);

      const res = await fetch(`${this.baseUrl}/products/lookup_barcode/?${query.toString()}`);
      if (!res.ok) {
        return { found: false, message: 'Item not found in database.' };
      }
      return await res.json();
    } catch (err) {
      return { found: false, message: (err as Error).message };
    }
  }

  /**
   * Fetch offers
   */
  async getOffers(shopId?: string): Promise<Offer[] | null> {
    if (this.isOnlineCached === false) return null;
    try {
      const query = shopId ? `?shop_id=${shopId}` : '';
      const res = await fetch(`${this.baseUrl}/offers/${query}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Create an order in Django backend
   */
  async createOrder(orderData: Partial<Order>): Promise<Order | null> {
    if (this.isOnlineCached === false) return null;
    try {
      const res = await fetch(`${this.baseUrl}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Verify an exit pass QR code
   */
  async verifyExitPass(orderId: string): Promise<boolean> {
    if (this.isOnlineCached === false) return false;
    try {
      const res = await fetch(`${this.baseUrl}/orders/${orderId}/verify_exit_pass/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Fetch loyalty cards
   */
  async getLoyaltyCards(): Promise<LoyaltyCard[] | null> {
    if (this.isOnlineCached === false) return null;
    try {
      const res = await fetch(`${this.baseUrl}/loyalty/`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Fetch community feed posts
   */
  async getFeedPosts(): Promise<FeedPost[] | null> {
    if (this.isOnlineCached === false) return null;
    try {
      const res = await fetch(`${this.baseUrl}/feed/`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Like a post in Django
   */
  async likePost(postId: string): Promise<number | null> {
    try {
      const res = await fetch(`${this.baseUrl}/feed/${postId}/like/`, {
        method: 'POST'
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.likes;
    } catch {
      return null;
    }
  }
  /**
   * Fetch authenticated user profile
   */
  async getUserProfile(): Promise<any | null> {
    try {
      const res = await fetch(`${this.baseUrl}/users/me`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  }

  /**
   * Update user profile details
   */
  async updateUserProfile(data: any): Promise<any | null> {
    try {
      const res = await fetch(`${this.baseUrl}/users/update_profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) return null;
      const resData = await res.json();
      return resData.user || null;
    } catch {
      return null;
    }
  }

  /**
   * Backend-driven role switch
   */
  async switchRole(role: string): Promise<any | null> {
    try {
      const res = await fetch(`${this.baseUrl}/users/switch_role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Register as Shop Owner
   */
  async becomeShopOwner(shopData: { shopName: string; category: string; address: string; phone: string }): Promise<any | null> {
    try {
      const res = await fetch(`${this.baseUrl}/users/become_shop_owner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shopData)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Toggle saved product
   */
  async toggleSavedProduct(productId: string): Promise<string[] | null> {
    try {
      const res = await fetch(`${this.baseUrl}/users/saved_products/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.savedProductIds || null;
    } catch {
      return null;
    }
  }

  /**
   * Delete account
   */
  async deleteAccount(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/users/delete_account`, {
        method: 'POST'
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const djangoApi = new DjangoApiService();
