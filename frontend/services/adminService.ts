import { api } from '@/lib/api';

export async function getAllAdmins() {
  const { data } = await api.get('/admin');
  return data;
}

export async function getAdminById(id: number) {
  const { data } = await api.get(`/admin/${id}`);
  return data;
}

export async function updateAdmin(id: number, formData: FormData) {
  const { data } = await api.patch(`/admin/${id}`, formData);
  return data;
}

export async function createAdmin(formData: FormData) {
  const { data } = await api.post('/admin', formData);
  return data;
}

export async function deleteAdmin(id: number) {
  const { data } = await api.delete(`/admin/${id}`);
  return data;
}