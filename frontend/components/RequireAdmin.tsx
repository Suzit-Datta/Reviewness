"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth";

export default function RequireAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (!auth || auth.role !== "ADMIN") {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return <p className="text-secondary">Checking access…</p>;
  return <>{children}</>;
}