'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
      <main className="max-w-4xl w-full bg-gray-900 rounded-2xl shadow-2xl p-12 flex flex-col items-center border border-gray-700">
        <h1
          className="
            text-5xl font-extrabold mb-12 text-center text-white
            drop-shadow-xl
            animate-[pulse_3s_ease-in-out_infinite]
            select-none
          "
        >
          Customer Traffic Dashboard
        </h1>

        <div className="flex space-x-10">
          <button
            onClick={() => router.push('/live')}
            className="
              px-12 py-4 bg-gray-800 text-indigo-400 rounded-lg font-semibold
              shadow-lg border border-indigo-600
              hover:shadow-xl hover:bg-indigo-900
              transition duration-300 ease-in-out
              transform hover:-translate-y-1 hover:scale-110 active:scale-95
              focus:outline-none focus:ring-4 focus:ring-indigo-600
              select-none
            "
            aria-label="Go to Live dashboard"
          >
            Live
          </button>

          <button
            onClick={() => router.push('/history')}
            className="
              px-12 py-4 bg-gray-800 text-indigo-400 rounded-lg font-semibold
              shadow-lg border border-indigo-600
              hover:shadow-xl hover:bg-indigo-900
              transition duration-300 ease-in-out
              transform hover:-translate-y-1 hover:scale-110 active:scale-95
              focus:outline-none focus:ring-4 focus:ring-indigo-600
              select-none
            "
            aria-label="Go to History dashboard"
          >
            History
          </button>
        </div>
      </main>
    </div>
  );
}
