import { api } from '@/lib/api';

export async function getAllEmployees() {
  const { data } = await api.get('/employee');
  return data;
}

export async function getPendingEmployees() {
  const { data } = await api.get('/admin/employees/pending');
  return data;
}

export async function approveEmployee(id: number) {
  const { data } = await api.patch(`/admin/employees/${id}/approve`);
  return data;
}

export async function rejectEmployee(id: number) {
  const { data } = await api.patch(`/admin/employees/${id}/reject`);
  return data;
}

export async function deleteEmployee(id: number) {
  const { data } = await api.delete(`/employee/${id}`);
  return data;
}
export async function getEmployeeById(id: number) {
  const { data } = await api.get(`/employee/${id}`);
  return data;
}