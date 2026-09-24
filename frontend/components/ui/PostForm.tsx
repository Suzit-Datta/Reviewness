"use client";

import { useEffect, useState } from "react";

import { FormField } from "./FormField";
import { createPost, updatePost } from "@/services/postService";
import { getAllProducts } from "@/services/productService";
import { getAllCompanies } from "@/services/companyService";

type Company = {
  id: number;
  companyName: string;
};

type Product = {
  id: number;
  name: string;
  companyId: number;
  categoryId: number;
};

type PostData = {
  id?: number;
  caption: string;
  rating: number;
  companyId: number;
  categoryId: number;
  productId: number;
};

export function PostForm({
  initialData,
  onSuccess,
}: {
  initialData?: PostData;
  onSuccess: () => void;
}) {
  const [companies, setCompanies] = useState<Company[]>([]);

  const [products, setProducts] = useState<Product[]>([]);

  const [caption, setCaption] = useState(initialData?.caption ?? "");

  const [rating, setRating] = useState(initialData?.rating ?? 0);

  const [companyId, setCompanyId] = useState(
    initialData?.companyId ? String(initialData.companyId) : "",
  );

  const [productId, setProductId] = useState(
    initialData?.productId ? String(initialData.productId) : "",
  );

  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId ? String(initialData.categoryId) : "",
  );

  const [photo, setPhoto] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllCompanies()
      .then(setCompanies)
      .catch(() => setError("Could not load companies."));

    getAllProducts()
      .then(setProducts)
      .catch(() => setError("Could not load products."));
  }, []);

  const productsForCompany = companyId
    ? products.filter((product) => product.companyId === Number(companyId))
    : [];

  function handleCompanyChange(value: string) {
    setCompanyId(value);
    setProductId("");
    setCategoryId("");
  }

  function handleProductChange(value: string) {
    setProductId(value);

    const product = products.find((item) => item.id === Number(value));

    if (product) {
      setCompanyId(String(product.companyId));
      setCategoryId(String(product.categoryId));
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError("");

    if (!companyId) {
      setError("Please select a company.");
      return;
    }

    if (!caption.trim()) {
      setError("Please write your review.");
      return;
    }

    if (rating < 0 || rating > 5) {
      setError("Rating must be between 0 and 5.");
      return;
    }

    if (!productId) {
      setError("Please select a product.");
      return;
    }

    const userId = Number(localStorage.getItem("userId"));

    if (!userId) {
      setError("You must be logged in.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("caption", caption);
      data.append("rating", String(rating));
      data.append("userId", String(userId));
      data.append("companyId", companyId);
      data.append("categoryId", categoryId);
      data.append("productId", productId);

      if (photo) {
        data.append("photo", photo);
      }

      if (initialData?.id) {
        await updatePost(initialData.id, data);
      } else {
        await createPost(data);
      }

      onSuccess();
    } catch (err: any) {
      const message = err?.response?.data?.message ?? "Something went wrong.";

      setError(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-base-300 bg-base-100 p-8"
    >
      <div className="space-y-5">
        <FormField label="Company">
          <select
            className="select select-bordered w-full"
            value={companyId}
            onChange={(e) => handleCompanyChange(e.target.value)}
          >
            <option value="">Select a company</option>

            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.companyName}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Product">
          <select
            className="select select-bordered w-full"
            value={productId}
            onChange={(e) => handleProductChange(e.target.value)}
            disabled={!companyId}
          >
            <option value="">
              {companyId ? "Select a product" : "Select a company first"}
            </option>

            {productsForCompany.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Rating">
          <select
            className="select select-bordered w-full"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value="0">0 - No rating</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Below average</option>
            <option value="3">3 - Average</option>
            <option value="4">4 - Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </FormField>

        <FormField label="Your Review">
          <textarea
            className="textarea textarea-bordered min-h-40 w-full"
            placeholder="Share your honest experience..."
            maxLength={255}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <p className="mt-1 text-right text-xs text-secondary">
            {caption.length}/255
          </p>
        </FormField>

        <FormField label="Photo (optional)">
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="file-input file-input-bordered w-full"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
        </FormField>
      </div>

      {error && (
        <div className="mt-5 rounded-lg bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary mt-8 w-full"
      >
        {loading
          ? "Saving..."
          : initialData?.id
            ? "Update Review"
            : "Publish Review"}
      </button>
    </form>
  );
}
