import { api } from "@/lib/api";

export async function getCommentsByPost(postId: number) {
  const { data } = await api.get(`/comment/post/${postId}`);

  return data;
}

export async function createComment(
  content: string,
  postId: number,
  userId: number,
) {
  const { data } = await api.post("/comment", {
    content,
    postId,
    userId,
  });

  return data;
}

export async function updateComment(id: number, content: string) {
  const { data } = await api.patch(`/comment/${id}`, { content });

  return data;
}

export async function deleteComment(id: number) {
  const { data } = await api.delete(`/comment/${id}`);

  return data;
}
