"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { api } from "../../../lib/api";
import { getRole } from "../../../lib/auth";

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
    isSubscribe: boolean;
    isApproved: boolean;
};

export default function CompanyDashboard() {
    const [company, setCompany] = useState<Company | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const getCompany = async () => {
            try {
                const role = getRole();

                if (role !== "COMPANY") {
                    setError("You are not authorized to access this dashboard.");
                    return;
                }

                const userId = localStorage.getItem("userId");

                if (!userId) {
                    setError("Company information not found. Please login again.");
                    return;
                }

                const companyId = Number(userId);

                if (Number.isNaN(companyId)) {
                    setError("Invalid company ID.");
                    return;
                }

                const response = await api.get(`/companies/${companyId}`);

                setCompany(response.data);
            } catch (error) {
                console.error(error);
                setError("Failed to load company data.");
            }
        };

        getCompany();
    }, []);

    if (error) {
        return (
            <div className="p-8">
                <div className="rounded-lg bg-red-50 p-4">
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="p-8">
                <p>Loading company...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold">
                    Company Dashboard
                </h2>

                <p className="mt-2 text-gray-500">
                    Manage your company, products and customer reviews.
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <Link
                    href="/company/dashboard/profile"
                    className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                    <h3 className="text-lg font-semibold">
                        Edit Profile
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                        Update your company information.
                    </p>
                </Link>

                <Link
                    href="/company/dashboard/products"
                    className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                    <h3 className="text-lg font-semibold">
                        Manage Products
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                        Add, edit and delete your products.
                    </p>
                </Link>

                <Link
                    href="/company/dashboard/posts"
                    className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                    <h3 className="text-lg font-semibold">
                        Customer Reviews
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                        See reviews posted by customers.
                    </p>
                </Link>

            </div>

            {/* Company Information */}
            <div className="max-w-4xl rounded-xl bg-white p-8 shadow-sm">

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-semibold">
                            Company Information
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Your registered company information
                        </p>
                    </div>

                    <Link
                        href="/company/dashboard/profile"
                        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                    >
                        Edit
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    {/* Company Name */}
                    <div>
                        <p className="text-sm text-gray-500">
                            Company Name
                        </p>

                        <p className="mt-1 text-lg font-medium">
                            {company.companyName}
                        </p>
                    </div>

                    {/* Email */}
                    <div>
                        <p className="text-sm text-gray-500">
                            Email
                        </p>

                        <p className="mt-1 text-lg font-medium">
                            {company.email}
                        </p>
                    </div>

                    {/* Phone */}
                    <div>
                        <p className="text-sm text-gray-500">
                            Phone
                        </p>

                        <p className="mt-1 text-lg font-medium">
                            {company.phone || "Not provided"}
                        </p>
                    </div>

                    {/* Location */}
                    <div>
                        <p className="text-sm text-gray-500">
                            Location
                        </p>

                        <p className="mt-1 text-lg font-medium">
                            {company.location || "Not provided"}
                        </p>
                    </div>

                    {/* Website */}
                    <div>
                        <p className="text-sm text-gray-500">
                            Website
                        </p>

                        <p className="mt-1 text-lg font-medium">
                            {company.website || "Not provided"}
                        </p>
                    </div>

                    {/* Industry */}
                    <div>
                        <p className="text-sm text-gray-500">
                            Industry ID
                        </p>

                        <p className="mt-1 text-lg font-medium">
                            {company.industryId}
                        </p>
                    </div>

                    {/* Subscription */}
                    <div>
                        <p className="text-sm text-gray-500">
                            Subscription
                        </p>

                        <p className="mt-1 text-lg font-medium">
                            {company.isSubscribe
                                ? "Subscribed"
                                : "Free"}
                        </p>
                    </div>

                    {/* Approval */}
                    <div>
                        <p className="text-sm text-gray-500">
                            Approval Status
                        </p>

                        <p className="mt-1 text-lg font-medium">
                            {company.isApproved
                                ? "Approved"
                                : "Pending"}
                        </p>
                    </div>

                </div>

                {/* Description */}
                <div className="mt-6">
                    <p className="text-sm text-gray-500">
                        Description
                    </p>

                    <p className="mt-1 text-gray-700">
                        {company.description || "No description"}
                    </p>
                </div>

            </div>

        </div>
    );
}