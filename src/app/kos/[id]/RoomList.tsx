"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Room = {
  id: number;
  roomNumber: string;
  type: string;
  price: number;
  facilities: string | null;
  imageUrl: string;
  isAvailable: boolean;
};

type RoomListProps = {
  rooms: Room[];
};

function formatRupiah(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function RoomList({ rooms }: RoomListProps) {
  const [search, setSearch] = useState("");

  const filteredRooms = rooms.filter((room) => {
    const formattedPrice = formatRupiah(room.price);

    return `${room.roomNumber} ${room.type} ${room.facilities || ""} ${room.price} ${formattedPrice}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  return (
    <>
      <div className="mt-6">
        <input
          type="text"
          placeholder="Cari kamar berdasarkan nomor, tipe, atau fasilitas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      {filteredRooms.length === 0 && (
        <div className="mt-6 rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">Kamar tidak ditemukan.</p>
        </div>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="relative h-48 w-full">
              {room.imageUrl ? (
                <Image
                  src={room.imageUrl}
                  alt={`Kamar ${room.roomNumber}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-200 text-sm text-gray-500">
                  No Image
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Kamar {room.roomNumber}
                  </h3>

                  <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {room.type || "Standard"}
                  </span>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    room.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {room.isAvailable ? "Tersedia" : "Penuh"}
                </span>
              </div>

              <p className="mt-5 text-2xl font-bold text-blue-600">
                {formatRupiah(room.price)}
              </p>

              <p className="mt-3 flex-1 text-sm text-gray-600">
                {room.facilities || "Fasilitas belum diisi"}
              </p>

              {room.isAvailable ? (
                <Link
                  href={`/bookings/create?roomId=${room.id}`}
                  className="mt-5 block rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white transition hover:bg-blue-700"
                >
                  Booking Kamar
                </Link>
              ) : (
                <button
                  disabled
                  className="mt-5 block w-full cursor-not-allowed rounded-lg bg-gray-300 px-4 py-2 font-medium text-gray-500"
                >
                  Tidak Tersedia
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
