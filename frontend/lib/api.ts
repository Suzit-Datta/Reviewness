import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach the token to every request if we have one
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Auth ──
export async function login(data: {
  role: string;
  email: string;
  password: string;
}): Promise<{ accessToken: string; role: string; id: number }> {
  const res = await api.post('/auth/login', data);
  return res.data;
}

// ── Types ──
export interface Employee {
  id: number;
  userName: string;
  email: string;
  image?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Industry {
  id: number;
  industryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: number;
  companyName: string;
  email: string;
  industryId: number;
  location?: string;
  website?: string;
  description?: string;
  logo?: string;
  phone?: string;
  isSubscribe?: boolean;
  isApproved?: boolean;
}

export interface AppUser {
  id: number;
  userName: string;
  email: string;
  image?: string;
  gender?: string;
}

// ── Employee calls ──
export async function getEmployees(): Promise<Employee[]> {
  const res = await api.get('/employee');
  return res.data;
}
export async function getEmployee(id: number): Promise<Employee> {
  const res = await api.get(`/employee/${id}`);
  return res.data;
}
export async function searchEmployees(name: string): Promise<Employee[]> {
  const res = await api.get('/employee/search', { params: { name } });
  return res.data;
}
export async function createEmployee(formData: FormData): Promise<Employee> {
  const res = await api.post('/employee', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}
export async function updateEmployee(
  id: number,
  data: Partial<Employee>
): Promise<Employee> {
  const res = await api.patch(`/employee/${id}`, data);
  return res.data;
}
export async function deleteEmployee(id: number): Promise<void> {
  await api.delete(`/employee/${id}`);
}

// ── Industry calls ──
export async function getIndustries(): Promise<Industry[]> {
  const res = await api.get('/industry');
  return res.data;
}
export async function getIndustry(id: number): Promise<Industry> {
  const res = await api.get(`/industry/${id}`);
  return res.data;
}
export async function createIndustry(data: {
  industryName: string;
}): Promise<Industry> {
  const res = await api.post('/industry', data);
  return res.data;
}
export async function updateIndustry(
  id: number,
  data: { industryName: string }
): Promise<Industry> {
  const res = await api.patch(`/industry/${id}`, data);
  return res.data;
}
export async function deleteIndustry(id: number): Promise<void> {
  await api.delete(`/industry/${id}`);
}
export async function getIndustryCompanies(id: number): Promise<Company[]> {
  const res = await api.get(`/industry/${id}/companies`);
  return res.data;
}

// ── Company calls (Employee manages) ──
export async function getCompanies(): Promise<Company[]> {
  const res = await api.get('/companies');
  return res.data;
}
export async function getCompany(id: number): Promise<Company> {
  const res = await api.get(`/companies/${id}`);
  return res.data;
}
export async function approveCompany(id: number): Promise<Company> {
  const res = await api.patch(`/companies/${id}`, { isApproved: true });
  return res.data;
}
export async function rejectCompany(id: number): Promise<Company> {
  const res = await api.patch(`/companies/${id}`, { isApproved: false });
  return res.data;
}

// ── Users (Employee views only) ──
export async function getUsers(): Promise<AppUser[]> {
  const res = await api.get('/users');
  return res.data;
}