export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  gallery?: string[];
  price_label?: string;
  features?: string[];
  use_cases?: string[];
  category: string;
  sort_order?: number;
  stock?: number;
  is_active?: boolean;
  length?: number;
  breadth?: number;
  width?: number;
  height?: number;
  volume?: number;
  dimension_unit?: string;
  weight?: number;
  weight_unit?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface Slider {
  id: string;
  title: string;
  link_url: string;
  image_url: string;
  order?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserDetails {
  name: string;
  phone: string;
  address?: string;
}

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
}
