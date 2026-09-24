import { api } from '@/lib/api';

export type LoginPayload = {
  role: string;
  email: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const { data } = await api.post('/auth/login', payload);
  return data; 
}

export async function registerAdmin(formData: FormData) {
  const { data } = await api.post('/admin', formData);
  return data;
}

export async function registerUser(formData: FormData) {
  const { data } = await api.post('/users', formData);
  return data;
}

export async function registerCompany(formData: FormData) {
  const { data } = await api.post('/companies', formData);
  return data;
}

export async function registerEmployee(formData: FormData) {
  const { data } = await api.post('/employee', formData);
  return data;
}