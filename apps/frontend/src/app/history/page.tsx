'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type HistoryItem = {
  store_id: number;
  hour: number;
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
    <main className="min-h-screen p-6 bg-white max-w-4xl mx-auto">
      <div className="flex justify-between mb-6">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Home
        </button>
        <button
          onClick={() => router.push('/live')}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-blue-700 transition"
        >
          Live
        </button>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Historical Customer Traffic (Last 24h)</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Store ID</th>
              <th className="border px-4 py-2">Hour</th>
              <th className="border px-4 py-2">Customers In</th>
              <th className="border px-4 py-2">Customers Out</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, i) => (
              <tr key={i} className="text-center">
                <td className="border px-4 py-2">{item.store_id}</td>
                <td className="border px-4 py-2">{item.hour}:00</td>
                <td className="border px-4 py-2">{item.customers_in}</td>
                <td className="border px-4 py-2">{item.customers_out}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
