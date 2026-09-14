"use client";

import { useRouter } from "next/navigation";
import { deleteIndustry } from "@/lib/api";

export default function DeleteIndustryButton({ id }: { id: number }) {
  const router = useRouter();
  async function handleDelete() {
    if (!confirm("Delete this industry?")) return;
    await deleteIndustry(id);
    router.push("/industry");
    router.refresh();
  }
  return (
    <button
      onClick={handleDelete}
      className="bg-danger text-white px-3 py-1.5 rounded-md text-sm hover:opacity-90"
    >
      Delete
    </button>
  );
}