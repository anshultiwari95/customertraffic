'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type HistoryItem = {
  store_id: number;
  hour: number; // you can keep this if you want to keep the data but not show it
  customers_in: number;
  customers_out: number;
};

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/history`)
      .then((res) => res.json())
      .then((data: HistoryItem[]) => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
      <main className="w-full max-w-5xl bg-gray-900 rounded-2xl shadow-2xl p-10 border border-gray-700">
        <div className="flex justify-between mb-8">
          <button
            onClick={() => router.push('/')}
            className="
              px-6 py-3 bg-gray-800 text-indigo-400 rounded-lg font-semibold
              shadow-lg border border-indigo-600
              hover:shadow-xl hover:bg-indigo-900
              transition duration-300 ease-in-out
              transform hover:-translate-y-1 hover:scale-105 active:scale-95
              focus:outline-none focus:ring-4 focus:ring-indigo-600
              select-none
            "
            aria-label="Go to Home"
          >
            Home
          </button>
          <button
            onClick={() => router.push('/live')}
            className="
              px-6 py-3 bg-gray-800 text-indigo-400 rounded-lg font-semibold
              shadow-lg border border-indigo-600
              hover:shadow-xl hover:bg-indigo-900
              transition duration-300 ease-in-out
              transform hover:-translate-y-1 hover:scale-105 active:scale-95
              focus:outline-none focus:ring-4 focus:ring-indigo-600
              select-none
            "
            aria-label="Go to Live"
          >
            Live
          </button>
        </div>

        <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-300 drop-shadow-lg select-none">
          Historical Customer Traffic (Last 24h)
        </h1>

        {loading ? (
          <p className="text-center text-indigo-400 select-none">Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-indigo-700 shadow-lg bg-white">
            <table className="min-w-full divide-y divide-indigo-700 table-auto">
              <thead className="bg-gray-100">
                <tr>
                  {['Store ID', 'Customers In', 'Customers Out'].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider select-none"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-300">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-indigo-500 italic select-none">
                      No historical data available
                    </td>
                  </tr>
                ) : (
                  history.map(({ store_id, customers_in, customers_out }, i) => (
                    <tr
                      key={i}
                      className="hover:bg-indigo-100 transition-colors cursor-default select-text"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-indigo-900 font-medium">{store_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-indigo-900">{customers_in}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-indigo-900">{customers_out}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
