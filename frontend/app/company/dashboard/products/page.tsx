"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { api } from "../../../../lib/api";

type Product = {
    id: number;
    name: string;
    rating: number;
    companyId: number;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
};

export default function AllProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function getProducts() {
            try {
                const role = localStorage.getItem("role");
                const userId = localStorage.getItem("userId");

                if (role !== "COMPANY") {
                    setError("You are not authorized to access this page.");
                    return;
                }

                if (!userId) {
                    setError("Company information not found. Please login again.");
                    return;
                }

                const companyId = Number(userId);

                const response = await api.get(
                    `/products/company/${companyId}`
                );

                setProducts(response.data);
            } catch (error: any) {
                console.error(error);

                const message = error?.response?.data?.message;

                if (Array.isArray(message)) {
                    setError(message[0]);
                } else {
                    setError(message || "Failed to load products.");
                }
            } finally {
                setLoading(false);
            }
        }

        getProducts();
    }, []);

    async function handleDelete(productId: number) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/products/${productId}`);

            setProducts((currentProducts) =>
                currentProducts.filter(
                    (product) => product.id !== productId
                )
            );
        } catch (error: any) {
            console.error(error);

            const message = error?.response?.data?.message;

            if (Array.isArray(message)) {
                setError(message[0]);
            } else {
                setError(message || "Failed to delete product.");
            }
        }
    }

    if (loading) {
        return (
            <div>
                <h2 className="text-3xl font-bold">
                    All Products
                </h2>

                <p className="mt-4 text-gray-500">
                    Loading products...
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">
                        All Products
                    </h2>

                    <p className="mt-2 text-gray-500">
                        View and manage all products of your company.
                    </p>
                </div>

                <Link
                    href="/company/dashboard/products/new"
                    className="rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
                >
                    + Add Product
                </Link>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4">
                    <p className="text-red-600">
                        {error}
                    </p>
                </div>
            )}

            {/* No products */}
            {products.length === 0 && !error && (
                <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                    <h3 className="text-xl font-semibold">
                        No products found
                    </h3>

                    <p className="mt-2 text-gray-500">
                        You have not added any products yet.
                    </p>

                    <Link
                        href="/company/dashboard/products/new"
                        className="mt-6 inline-block rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
                    >
                        Add Your First Product
                    </Link>
                </div>
            )}

            {/* Products */}
            {products.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="rounded-xl bg-white p-6 shadow-sm"
                        >
                            <div className="mb-5">
                                <h3 className="text-xl font-semibold">
                                    {product.name}
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    Product ID: {product.id}
                                </p>
                            </div>

                            <div className="space-y-2 text-sm">
                                <p>
                                    <span className="font-medium">
                                        Category ID:
                                    </span>{" "}
                                    {product.categoryId}
                                </p>

                                <p>
                                    <span className="font-medium">
                                        Rating:
                                    </span>{" "}
                                    {Number(product.rating).toFixed(1)} / 5
                                </p>

                                <p>
                                    <span className="font-medium">
                                        Company ID:
                                    </span>{" "}
                                    {product.companyId}
                                </p>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <Link
                                    href={`/company/dashboard/products/${product.id}`}
                                    className="flex-1 rounded-lg border px-4 py-2 text-center text-sm font-medium hover:bg-gray-100"
                                >
                                    View
                                </Link>

                                <Link
                                    href={`/company/dashboard/products/${product.id}/edit`}
                                    className="flex-1 rounded-lg bg-black px-4 py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}