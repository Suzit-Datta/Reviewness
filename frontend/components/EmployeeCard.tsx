import Link from "next/link";
import { Employee } from "@/lib/api";

export default function EmployeeCard({ employee }: { employee: Employee }) {
  const imageUrl = employee.image
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${employee.image}`
    : null;

  return (
    <Link
      href={`/employee/${employee.id}`}
      className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg p-4 hover:border-primary transition"
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-slate-400 shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={employee.userName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{employee.userName[0]?.toUpperCase()}</span>
        )}
      </div>
      <div>
        <p className="font-medium text-slate-900">{employee.userName}</p>
        <p className="text-sm text-slate-500">
          {employee.position || "No position set"}
        </p>
      </div>
    </Link>
  );
}