export type Review = {
  category: string;
  product: string;
  rating: number;
  text: string;
  reviewer: string;
  date: string;
};

export type NavLink = {
  label: string;
  href: string;
};

export type Post = {
  id: number;
  caption: string;
  rating: number;
  image?: string;
  userId: number;
  companyId: number;
  categoryId: number;
  productId: number;
  createdAt: string;
  updatedAt: string;
};