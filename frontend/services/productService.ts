import { api } from '@/lib/api';

export async function getProductById(id: number) {
  const { data } = await api.get(`/products/${id}`);
  return data; // includes name
}

// keep your existing getAllPosts import elsewhere if it's in postService