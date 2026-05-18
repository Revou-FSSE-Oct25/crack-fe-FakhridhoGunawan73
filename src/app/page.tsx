"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import KosCard from "@/components/KosCard";

type Kos = {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string;
};

export default function Home() {
  const [kosList, setKosList] = useState<Kos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const filteredKosList = kosList.filter((kos) =>
    `${kos.name} ${kos.city} ${kos.address}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  useEffect(() => {
    async function fetchKos() {
      try {
        const response = await api.get("/kos");
        setKosList(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to retrieve boarding house data",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchKos();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-b from-blue-600 to-blue-700 px-8 py-24 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">
              Kostify
            </p>

            <h1 className="text-5xl font-bold leading-tight">
              Temukan Kos Nyaman
              <br />
              Dengan Booking Online
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Cari kos dengan mudah, lihat detail kamar, dan booking langsung
              tanpa ribet.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#kos-list"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 shadow-md transition hover:bg-blue-50"
              >
                Cari Kos
              </a>

              <a
                href="/my-bookings"
                className="rounded-xl border border-white/70 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-blue-700"
              >
                My Bookings
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="kos-list" className="mx-auto max-w-6xl px-8 py-16">
        <div className="mb-10">
          <input
            type="text"
            placeholder="Cari kos berdasarkan nama, kota, atau alamat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 bg-white px-6 py-4 text-lg outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900">
            Daftar Kos Tersedia
          </h2>

          <p className="mt-2 text-gray-500">
            Temukan kos terbaik sesuai kebutuhan kamu.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">Loading data kos...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && kosList.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-700">
              Belum ada kos tersedia
            </h2>

            <p className="mt-2 text-gray-500">Silakan kembali lagi nanti.</p>
          </div>
        )}

        {!loading &&
          !error &&
          kosList.length > 0 &&
          filteredKosList.length === 0 && (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-gray-500">Kos tidak ditemukan.</p>
            </div>
          )}

        {!loading && !error && filteredKosList.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredKosList.map((item) => (
              <KosCard
                key={item.id}
                id={item.id}
                name={item.name}
                city={item.city}
                address={item.address}
                description={item.description}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
