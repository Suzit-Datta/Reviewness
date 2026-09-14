import Link from "next/link";
import LogoutButton from "../LogoutButton";
import NotificationListener from '@/components/company/NotificationListener';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-100 flex">

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r p-6">

                <h1 className="text-2xl font-bold mb-8">
                    Reviewness
                </h1>

                <nav className="space-y-2">

                    <Link
                        href="/company/dashboard"
                        className="block rounded-lg px-4 py-3 hover:bg-gray-100"
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/company/dashboard/profile"
                        className="block rounded-lg px-4 py-3 hover:bg-gray-100"
                    >
                        Edit Profile
                    </Link>

                    <Link
                        href="/company/dashboard/products/new"
                        className="block rounded-lg px-4 py-3 hover:bg-gray-100"
                    >
                        Add Product
                    </Link>

                    <Link
                        href="/company/dashboard/products"
                        className="block rounded-lg px-4 py-3 hover:bg-gray-100"
                    >
                        All Products
                    </Link>

                    <Link
                        href="/company/dashboard/posts"
                        className="block rounded-lg px-4 py-3 hover:bg-gray-100"
                    >
                        Customer Reviews
                    </Link>

                    <Link
                        href="../../feed"
                        className="block rounded-lg px-4 py-3 hover:bg-gray-100"
                    >
                        Review Feed
                    </Link>

                    <LogoutButton />

                </nav>

            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <NotificationListener />
                {children}
            </main>

        </div>
    );
}