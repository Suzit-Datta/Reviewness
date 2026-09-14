import { api } from '@/lib/api';

export async function getAllCompanies() {
  const { data } = await api.get('/companies');
  return data;
}

export async function getCompanyById(id: number) {
  const { data } = await api.get(`/companies/${id}`);
  return data;
}

export async function updateCompany(id: number, payload: Record<string, unknown>) {
  // JSON update (no file) — for toggling approval/subscription
  const { data } = await api.patch(`/companies/${id}`, payload);
  return data;
}

export async function deleteCompany(id: number) {
  const { data } = await api.delete(`/companies/${id}`);
  return data;
}