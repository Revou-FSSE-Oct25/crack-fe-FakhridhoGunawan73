"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

import { syncAccessTokenCookie } from "@/lib/storage";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      console.log("Login response:", response.data);

      const { accessToken } = response.data;
      if (accessToken) {
        syncAccessTokenCookie(accessToken);
      }

      window.location.href = nextPath;
    } catch (err: any) {
      setError(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-200">
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-20">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl"
        >
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Kostify
            </p>

            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>

            <p className="mt-2 text-sm text-gray-500">
              Login untuk melanjutkan booking kos kamu.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading ? "Loading..." : "Login"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Belum punya akun?{" "}
            <a
              href="/register"
              className="font-semibold text-blue-600 hover:underline"
            >
              Register
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
