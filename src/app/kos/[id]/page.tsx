import RoomList from "./RoomList";

type KosDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type Kos = {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string;
  rooms: Room[];
};

type Room = {
  id: number;
  roomNumber: string;
  type: string;
  price: number;
  facilities: string | null;
  imageUrl: string;
  isAvailable: boolean;
};

export default async function KosDetailPage({ params }: KosDetailPageProps) {
  const { id } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/kos/${id}`,
    {
      cache: "no-store",
    },
  );

  const kos: Kos = await response.json();

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-blue-600">{kos.city}</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{kos.name}</h1>
          <p className="mt-2 text-gray-600">{kos.address}</p>

          {kos.description && (
            <p className="mt-4 text-gray-700">{kos.description}</p>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900">Daftar Kamar</h2>
          <p className="mt-2 text-gray-600">
            Pilih kamar berdasarkan tipe, fasilitas, dan ketersediaan.
          </p>

          {!kos.rooms || kos.rooms.length === 0 ? (
            <div className="mt-6 rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-500">Belum ada kamar.</p>
            </div>
          ) : (
            <RoomList rooms={kos.rooms || []} />
          )}
        </section>
      </div>
    </main>
  );
}
