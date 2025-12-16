export type Category = 'Perfumes' | 'Accessories';
export type SubCategory = 'Twinkle Blends' | 'Designer Brands' | 'None';

export interface Product {
  id: string;
  title: string;
  category: Category;
  sub_category: SubCategory;
  price: number;
  description: string;
  images: string[];
  videoUrl?: string;
  stock: number;
  isFeatured: boolean;
  createdAt?: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  role?: 'admin' | 'user';
}