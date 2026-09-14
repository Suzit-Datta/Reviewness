"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "../../../../../lib/api";

type Category = {
    id: number;
    name: string;
};

export default function AddProductPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const [categories, setCategories] = useState<Category[]>([]);

    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Get all categories
    useEffect(() => {
        async function getCategories() {
            try {
                const response = await api.get("/category");

                setCategories(response.data);
            } catch (error) {
                console.error(error);
                setError("Failed to load categories.");
            } finally {
                setLoadingCategories(false);
            }
        }

        getCategories();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("Product name is required.");
            return;
        }

        if (name.trim().length < 2) {
            setError("Product name must be at least 2 characters.");
            return;
        }

        if (!categoryId) {
            setError("Please select a category.");
            return;
        }

        const role = localStorage.getItem("role");
        const userId = localStorage.getItem("userId");

        if (role !== "COMPANY") {
            setError("You are not authorized to add a product.");
            return;
        }

        if (!userId) {
            setError("Company information not found. Please login again.");
            return;
        }

        const companyId = Number(userId);
        const selectedCategoryId = Number(categoryId);

        try {
            setLoading(true);

            const response = await api.post("/products", {
                name: name.trim(),
                companyId: companyId,
                categoryId: selectedCategoryId,
            });

            console.log("Created product:", response.data);

            setSuccess("Product added successfully.");

            setName("");
            setCategoryId("");

            setTimeout(() => {
                router.push("/company/dashboard/products");
            }, 1000);
        } catch (error: any) {
            console.error(error);

            const message = error?.response?.data?.message;

            if (Array.isArray(message)) {
                setError(message[0]);
            } else {
                setError(message || "Failed to add product.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl">
            <div className="mb-8">
                <h2 className="text-3xl font-bold">
                    Add Product
                </h2>

                <p className="mt-2 text-gray-500">
                    Add a new product to your company.
                </p>
            </div>

            {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4">
                    <p className="text-red-600">
                        {error}
                    </p>
                </div>
            )}

            {success && (
                <div className="mb-6 rounded-lg bg-green-50 p-4">
                    <p className="text-green-600">
                        {success}
                    </p>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-xl bg-white p-8 shadow-sm"
            >
                {/* Product Name */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Product Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter product name"
                        minLength={2}
                        maxLength={150}
                        required
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Category
                    </label>

                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        disabled={loadingCategories}
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black disabled:bg-gray-100"
                    >
                        <option value="">
                            {loadingCategories
                                ? "Loading categories..."
                                : "Select a category"}
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Company */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Company
                    </label>

                    <div className="rounded-lg bg-gray-100 px-4 py-3 text-gray-600">
                        Your company
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                        This product will automatically belong to your company.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading || loadingCategories}
                        className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Adding Product..." : "Add Product"}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            router.push("/company/dashboard/products")
                        }
                        className="rounded-lg border px-6 py-3 font-medium hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}