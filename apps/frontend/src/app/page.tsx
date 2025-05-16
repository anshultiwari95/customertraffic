'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen p-6 max-w-4xl mx-auto bg-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8 text-center">Customer Traffic Dashboard</h1>

      <div className="flex space-x-6">
        <button
          onClick={() => router.push('/live')}
          className="px-8 py-3 bg-gray-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Live
        </button>

        <button
          onClick={() => router.push('/history')}
          className="px-8 py-3 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700 transition"
        >
          History
        </button>
      </div>
    </main>
  );
}
