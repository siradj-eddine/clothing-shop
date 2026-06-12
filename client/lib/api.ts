import axiosInstance from './axios';
import { Product, ProductsResponse, Cart, Order, LoginCredentials, AuthTokens ,Category } from './types';

export const productsApi = {
  getAll: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    size?: string;
    ordering?: string;
  }): Promise<ProductsResponse> => {
    // Add timestamp to prevent browser caching
    const response = await axiosInstance.get('/products/', { 
      params: {
        ...params,
        _t: Date.now()
      }
    });
    return response.data;
  },
  
  getBySlug: async (slug: string): Promise<Product> => {
    console.log('API call: getBySlug with slug:', slug);
    const response = await axiosInstance.get(`/products/${slug}/`);
    console.log('API response:', response.data);
    return response.data;
  },
  
  getCategories: async () => {
    const response = await axiosInstance.get('/products/categories/');
    return response.data;
  },

  create: async (productData: {
    name: string;
    slug: string;
    description: string;
    price: number;
    category: number | null;
    stock: number;
    sizes: string[];
    colors: string[];
    is_active: boolean;
  }): Promise<Product> => {
    const response = await axiosInstance.post('/products/create/', productData);
    return response.data;
  },

  update: async (slug: string, productData: Partial<{
    name: string;
    description: string;
    price: number;
    category: number;
    stock: number;
    sizes: string[];
    colors: string[];
    is_active: boolean;
  }>): Promise<Product> => {
    const response = await axiosInstance.patch(`/products/${slug}/update/`, productData);
    return response.data;
  },
  
  delete: async (slug: string): Promise<void> => {
    await axiosInstance.delete(`/products/${slug}/delete/`);
  },

  uploadImage: async (productId: number, imageFile: File, isMain: boolean = false, sortOrder: number = 0): Promise<any> => {
    const formData = new FormData();
    formData.append('product', productId.toString());
    formData.append('image', imageFile);
    formData.append('is_main', isMain.toString());
    formData.append('sort_order', sortOrder.toString());
    
    const response = await axiosInstance.post('/products/images/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  setMainImage: async (imageId: number): Promise<any> => {
    const response = await axiosInstance.post(`/products/images/${imageId}/set-main/`);
    return response.data;
  },

  deleteImage: async (imageId: number): Promise<void> => {
    await axiosInstance.delete(`/products/images/${imageId}/`);
  },

  getProductImages: async (productId: number): Promise<any[]> => {
    const response = await axiosInstance.get(`/products/${productId}/`);
    return response.data.images || [];
  },

  getAllCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get('/products/categories/');
    return response.data;
  },

  createCategory: async (data: { name: string; slug: string }): Promise<Category> => {
    const response = await axiosInstance.post('/products/categories/create/', data);
    return response.data;
  },

  updateCategory: async (slug: string, data: { name: string; slug: string }): Promise<Category> => {
    const response = await axiosInstance.put(`/products/categories/${slug}/update/`, data);
    return response.data;
  },

  deleteCategory: async (slug: string): Promise<void> => {
    await axiosInstance.delete(`/products/categories/${slug}/delete/`);
  },

};

export const cartApi = {
  get: async (): Promise<Cart> => {
    const response = await axiosInstance.get('/cart/');
    return response.data;
  },
  
  add: async (productId: number, quantity: number, size?: string, color?: string): Promise<Cart> => {
    console.log('Adding to cart:', { productId, quantity, size, color });
    const response = await axiosInstance.post('/cart/add/', {
      product_id: productId,
      quantity,
      size: size || '',
      color: color || '',
    });
    console.log('Add to cart response:', response.data);
    return response.data;
  },
  
  update: async (itemId: number, quantity: number): Promise<Cart> => {
    console.log(`[cartApi.update] Sending PUT to /cart/update/${itemId}/ with quantity:`, quantity);
    const response = await axiosInstance.put(`/cart/update/${itemId}/`, { quantity });
    console.log('[cartApi.update] Response:', response.data);
    return response.data;
  },
  
  remove: async (itemId: number): Promise<Cart> => {
    console.log(`[cartApi.remove] Sending DELETE to /cart/remove/${itemId}/`);
    const response = await axiosInstance.delete(`/cart/remove/${itemId}/`);
    console.log('[cartApi.remove] Response:', response.data);
    return response.data;
  },
  
  clear: async (): Promise<void> => {
    await axiosInstance.delete('/cart/clear/');
  },
};

export const ordersApi = {
  create: async (orderData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    subtotal?: number;
    shipping_cost?: number;
    total?: number;
    items: {
      product_name: string;
      product_price: string;
      quantity: number;
      size: string;
      color: string;
    }[];
  }): Promise<Order> => {
    const response = await axiosInstance.post('/orders/create/', orderData);
    return response.data;
  },
  getAll: async (): Promise<Order[]> => {
    const response = await axiosInstance.get('/orders/');
    return response.data;
  },
  getById: async (id: number, email?: string): Promise<Order> => {
    const url = email ? `/orders/${id}/?email=${email}` : `/orders/${id}/`;
    const response = await axiosInstance.get(url);
    return response.data;
  },
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const response = await axiosInstance.post('/token/', credentials);
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      await axiosInstance.post('/logout/');
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  
  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await axiosInstance.post('/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },
};

export const dashboardApi = {
  getStats: async () => {
    const response = await axiosInstance.get('/dashboard/stats/');
    return response.data;
  },
};