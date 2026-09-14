"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "../../../../lib/api";

type Company = {
    id: number;
    companyName: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    description?: string;
    logo?: string;
    industryId: number;
};

export default function EditProfilePage() {
    const router = useRouter();

    const [company, setCompany] = useState<Company | null>(null);

    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [website, setWebsite] = useState("");
    const [description, setDescription] = useState("");

    const [logo, setLogo] = useState<File | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const getCompany = async () => {
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

                const response = await api.get(`/companies/${companyId}`);

                const data = response.data;

                setCompany(data);

                setCompanyName(data.companyName || "");
                setEmail(data.email || "");
                setPhone(data.phone || "");
                setLocation(data.location || "");
                setWebsite(data.website || "");
                setDescription(data.description || "");
            } catch (error) {
                console.error(error);
                setError("Failed to load company information.");
            } finally {
                setLoading(false);
            }
        };

        getCompany();
    }, []);

    function isValidUrl(value: string) {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!company) {
            setError("Company information not found.");
            return;
        }

        if (!companyName.trim()) {
            setError("Company name is required.");
            return;
        }

        if (companyName.trim().length < 2) {
            setError("Company name must be at least 2 characters.");
            return;
        }

        if (website && !isValidUrl(website)) {
            setError(
                "Please enter a valid website URL, for example: https://example.com"
            );
            return;
        }

        try {
            setSaving(true);

            const formData = new FormData();

            formData.append("companyName", companyName.trim());
            formData.append("email", email.trim());
            formData.append("phone", phone.trim());
            formData.append("location", location.trim());
            formData.append("website", website.trim());
            formData.append("description", description.trim());

            if (logo) {
                formData.append("logo", logo);
            }

            const response = await api.patch(
                `/companies/${company.id}`,
                formData
            );

            setCompany(response.data);

            setSuccess("Company profile updated successfully.");

            setTimeout(() => {
                router.push("/company/dashboard");
            }, 1000);
        } catch (error: any) {
            console.error(error);

            const message = error?.response?.data?.message;

            if (Array.isArray(message)) {
                setError(message[0]);
            } else {
                setError(
                    message || "Failed to update company information."
                );
            }
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="p-8">
                <p className="text-gray-500">
                    Loading company information...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl">
            {/* Page Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold">
                    Edit Company Profile
                </h2>

                <p className="mt-2 text-gray-500">
                    Update your company information.
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4">
                    <p className="text-red-600">
                        {error}
                    </p>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="mb-6 rounded-lg bg-green-50 p-4">
                    <p className="text-green-600">
                        {success}
                    </p>
                </div>
            )}

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-xl bg-white p-8 shadow-sm"
            >
                {/* Company Name */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Company Name
                    </label>

                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        minLength={2}
                        maxLength={100}
                        required
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Phone
                        <span className="ml-1 text-gray-400">
                            (Optional)
                        </span>
                    </label>

                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={20}
                        placeholder="Enter phone number"
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Location
                        <span className="ml-1 text-gray-400">
                            (Optional)
                        </span>
                    </label>

                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        maxLength={150}
                        placeholder="Enter company location"
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                {/* Website */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Website
                        <span className="ml-1 text-gray-400">
                            (Optional)
                        </span>
                    </label>

                    <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                    />

                    <p className="mt-1 text-sm text-gray-500">
                        Leave this empty if your company does not have a website.
                    </p>
                </div>

                {/* Description */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Description
                        <span className="ml-1 text-gray-400">
                            (Optional)
                        </span>
                    </label>

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                        maxLength={500}
                        placeholder="Tell customers about your company..."
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                {/* Company Logo */}
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Company Logo
                        <span className="ml-1 text-gray-400">
                            (Optional)
                        </span>
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            setLogo(e.target.files?.[0] || null);
                        }}
                        className="w-full rounded-lg border p-3"
                    />

                    {company?.logo && (
                        <p className="mt-2 text-sm text-gray-500">
                            A logo is already uploaded. Choose a new file only
                            if you want to replace it.
                        </p>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving ? "Updating..." : "Update Profile"}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/company/dashboard")}
                        className="rounded-lg border px-6 py-3 font-medium hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}