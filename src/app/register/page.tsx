"use client";

import { use, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      router.push("/login");
    } catch (err: any) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Register gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-200">
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-20">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl"
        >
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Kostify
            </p>

            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>

            <p className="mt-2 text-sm text-gray-500">
              Daftar untuk mulai mencari dan booking kos impianmu.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama"
              required
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading ? "Loading..." : "Register"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
