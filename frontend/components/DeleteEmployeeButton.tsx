"use client";

import { useRouter } from "next/navigation";
import { deleteEmployee } from "@/lib/api";

export default function DeleteEmployeeButton({ id }: { id: number }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete this employee?")) return;
    await deleteEmployee(id);
    router.push("/employee");
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