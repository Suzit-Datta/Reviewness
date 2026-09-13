import { api } from '@/lib/api';

export async function getUserById(id: number) {
  const { data } = await api.get(`/users/${id}`);
  return data; // includes userName
}