import { api } from "@/lib/api";

export async function getAllCompanies() {
  const { data } = await api.get("/companies");

  return data;
}

export async function getCompanyById(id: number) {
  const { data } = await api.get(`/companies/${id}`);

  return data;
}

export async function searchCompanies(name: string) {
  const { data } = await api.get("/companies/search", {
    params: { name },
  });

  return data;
}
