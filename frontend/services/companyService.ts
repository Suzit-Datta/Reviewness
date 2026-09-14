<<<<<<< HEAD
import { api } from '@/lib/api';

export async function getAllCompanies() {
  const { data } = await api.get('/companies');
=======
import { api } from "@/lib/api";

export async function getAllCompanies() {
  const { data } = await api.get("/companies");

>>>>>>> feature/user
  return data;
}

export async function getCompanyById(id: number) {
  const { data } = await api.get(`/companies/${id}`);
<<<<<<< HEAD
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
=======

  return data;
}

export async function searchCompanies(name: string) {
  const { data } = await api.get("/companies/search", {
    params: { name },
  });

  return data;
}
>>>>>>> feature/user
