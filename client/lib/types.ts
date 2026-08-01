export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: number;
  image: string;
  image_url: string;
  is_main: boolean;
  sort_order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  category: number;
  category_name: string;
  stock: number;
  sizes: string[];
  colors: string[];
  is_active: boolean;
  images: ProductImage[];
  main_image_url: string;
  created_at: string;
}

export interface CartItem {
  id: number;
  product: number;
  product_name: string;
  product_price: string;
  product_image: string;
  quantity: number;
  size: string;
  color: string;
  subtotal: string;
}

export interface Cart {
  id: number;
  session_key: string;
  items: CartItem[];
  total: string;
  total_items: number;
}

export interface OrderItem {
  product_name: string;
  product_price: string;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  subtotal?: string;
  shipping_cost?: string;
  total: string;
  status: string;
  items: OrderItem[];
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}
export interface Category {
  id: number;
  name: string;
  slug: string;
  product_count?: number;
}
