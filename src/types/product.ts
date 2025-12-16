export interface Product {
  id: string;
  name: string;
  title: string;
  image: string;
  altText: string;
  price?: number;
  rating?: {
    rate: number;
    count: number;
  };
  description?: string;
  category?: string;
  customizable?: boolean;
  inStock?: boolean;
}

export interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price?: number;
  rating?: {
    rate: number;
    count: number;
  };
}

export interface CartItem extends WishlistItem {
  description?: string;
  quantity: number;
}
