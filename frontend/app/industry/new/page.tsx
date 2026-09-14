"use client";

import { useState, FormEvent } from "react";
import { createEmployee } from "@/lib/api";

export default function NewEmployeePage() {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    position: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.userName.trim()) errs.userName = "Username is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("userName", form.userName);
      data.append("email", form.email);
      data.append("password", form.password);
      if (form.position) data.append("position", form.position);
      if (photo) data.append("photo", photo);
      await createEmployee(data);
      setSubmitted(true);
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong";
      setErrors({ form: message });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto p-6 text-center py-16">
        <h1 className="text-xl font-bold text-navy mb-2">
          Registration submitted
        </h1>
        <p className="text-secondary">
          Your account is pending review. An admin must approve it before you
          can log in.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 w-full">
      <h1 className="text-xl font-bold text-navy mb-4">Employee Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy mb-1">
            Username
          </label>
          <input
            className="w-full border border-slate-300 rounded-md px-3 py-2"
            value={form.userName}
            onChange={(e) => setForm({ ...form, userName: e.target.value })}
          />
          {errors.userName && (
            <p className="text-danger text-sm mt-1">{errors.userName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-slate-300 rounded-md px-3 py-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-danger text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full border border-slate-300 rounded-md px-3 py-2"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && (
            <p className="text-danger text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-1">
            Position
          </label>
          <input
            className="w-full border border-slate-300 rounded-md px-3 py-2"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-1">
            Photo
          </label>
          <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-md px-4 py-6 cursor-pointer hover:border-primary transition text-secondary text-sm">
            {photo ? photo.name : "Click to choose a photo (JPG or PNG)"}
            <input
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {errors.form && <p className="text-danger text-sm">{errors.form}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-white py-2 rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create Employee"}
        </button>
      </form>
    </div>
  );
}