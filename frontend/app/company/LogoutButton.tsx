"use client";

import { useRouter } from "next/navigation";
import { clearAuth } from "../../lib/auth";

export default function LogoutButton() {
    const router = useRouter();

    function handleLogout() {
        clearAuth();
        router.replace("/login");
    }

    return (
        <button
            onClick={handleLogout}
            className="w-full text-left rounded-lg px-4 py-3 text-red-600 hover:bg-red-50"
        >
            Logout
        </button>
    );
}