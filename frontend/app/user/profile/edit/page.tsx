"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FormField } from "@/components/ui/FormField";
import { getUserById, updateUser } from "@/services/userService";
import { isLoggedIn } from "@/lib/auth";

export default function EditProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    userName: "",
    email: "",
    gender: "male",
    password: "",
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }

    const userId = Number(localStorage.getItem("userId"));

    getUserById(userId)
      .then((user) => {
        setForm({
          userName: user.userName,
          email: user.email,
          gender: user.gender,
          password: "",
        });
      })
      .catch(() => {
        setError("Could not load your profile.");
      })
      .finally(() => setLoading(false));
  }, [router]);

  function updateField(field: string, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError("");

    if (!form.userName || !form.email || !form.gender) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    try {
      const userId = Number(localStorage.getItem("userId"));

      const data = new FormData();

      data.append("userName", form.userName);
      data.append("email", form.email);
      data.append("gender", form.gender);

      if (form.password) {
        data.append("password", form.password);
      }

      if (photo) {
        data.append("photo", photo);
      }

      await updateUser(userId, data);

      router.push("/user/profile");
      router.refresh();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Profile update failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <Navbar />

      <main className="mx-auto w-full max-w-2xl flex-grow px-6 py-12">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold text-neutral">
          Edit Profile
        </h1>

        <p className="mt-2 text-secondary">Update your account information.</p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-8"
        >
          <div className="space-y-5">
            <FormField label="Username">
              <input
                className="input input-bordered w-full"
                value={form.userName}
                onChange={(e) => updateField("userName", e.target.value)}
              />
            </FormField>

            <FormField label="Email">
              <input
                type="email"
                className="input input-bordered w-full"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </FormField>

            <FormField label="Gender">
              <select
                className="select select-bordered w-full"
                value={form.gender}
                onChange={(e) => updateField("gender", e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </FormField>

            <FormField label="New Password (optional)">
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="Leave blank to keep current password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
              />
            </FormField>

            <FormField label="New Profile Photo (optional)">
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              />
            </FormField>
          </div>

          {error && (
            <div className="mt-5 rounded-lg bg-error/10 px-4 py-3 text-sm text-error">
              {Array.isArray(error) ? error.join(", ") : error}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary flex-1"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/user/profile")}
              className="btn btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
