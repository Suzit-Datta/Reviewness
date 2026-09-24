import { api } from "@/lib/api";

export async function getProductById(id: number) {
  const { data } = await api.get(`/products/${id}`);

  return data;
}

export async function getAllProducts() {
  const { data } = await api.get("/products");

  return data;
}

export async function searchProducts(name: string) {
  const { data } = await api.get("/products/search", {
    params: { name },
  });

  return data;
}
