import IndustriesClient from "./IndustriesClient";
import type { Industry } from "@/lib/api";

async function getIndustriesServerSide(): Promise<Industry[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/industry`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function IndustriesPage() {
  const industries = await getIndustriesServerSide();
  return <IndustriesClient initialIndustries={industries} />;
}