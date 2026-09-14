import { api } from "@/lib/api";

export async function getUserById(id: number) {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export async function getAllUsers() {
  const { data } = await api.get("/users");
  return data;
}

export async function getUserByUsername(userName: string) {
  const { data } = await api.get("/users", {
    params: { userName },
  });
  return data;
}

export async function updateUser(id: number, formData: FormData) {
  const { data } = await api.patch(`/users/${id}`, formData);

  return data;
}
