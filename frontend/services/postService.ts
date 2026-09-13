import { api } from '@/lib/api';
import type { Post } from '@/types';

export async function getAllPosts(): Promise<Post[]> {
  const { data } = await api.get('/posts');
  return data;
}
