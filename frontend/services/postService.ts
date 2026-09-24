import { api } from "@/lib/api";
import type { Post } from "@/types";

export async function getAllPosts(): Promise<Post[]> {
  const { data } = await api.get("/posts");
  return data;
}

export async function getPostById(id: number): Promise<Post> {
  const { data } = await api.get(`/posts/${id}`);
  return data;
}

export async function getPostsByUserId(userId: number): Promise<Post[]> {
  const { data } = await api.get(`/posts/user/${userId}`);

  return data;
}

export async function createPost(formData: FormData) {
  const { data } = await api.post("/posts", formData);

  return data;
}

export async function updatePost(id: number, formData: FormData) {
  const { data } = await api.patch(`/posts/${id}`, formData);

  return data;
}

export async function deletePost(id: number) {
  const { data } = await api.delete(`/posts/${id}`);

  return data;
}
