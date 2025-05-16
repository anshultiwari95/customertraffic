'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type LiveMessage = {
  store_id: number;
  customers_in: number;
  customers_out: number;
  time_stamp: string;
};

export default function LivePage() {
  const [liveData, setLiveData] = useState<LiveMessage[]>([]);
  const router = useRouter();

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

  useEffect(() => {
    async function fetchLive() {
      try {
        const res = await fetch(`${apiBaseUrl}/api/live`);
        if (!res.ok) throw new Error('Failed to fetch live data');
        const data: LiveMessage[] = await res.json();
        setLiveData(data);
      } catch (error) {
        console.error('Initial fetch error:', error);
      }
    }

    fetchLive();

    const ws = new WebSocket(apiBaseUrl.replace(/^http/, 'ws') + '/ws');

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const newMsg: LiveMessage = JSON.parse(event.data);
        setLiveData((prev) => [...prev.slice(-99), newMsg]);
      } catch (err) {
        console.error('Failed to parse message:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('❌ WebSocket error:', err);
    };

    ws.onclose = () => {
      console.warn('⚠️ WebSocket connection closed');
    };

    return () => ws.close();
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
            onClick={() => router.push('/history')}
            className="
              px-6 py-3 bg-gray-800 text-indigo-400 rounded-lg font-semibold
              shadow-lg border border-indigo-600
              hover:shadow-xl hover:bg-indigo-900
              transition duration-300 ease-in-out
              transform hover:-translate-y-1 hover:scale-105 active:scale-95
              focus:outline-none focus:ring-4 focus:ring-indigo-600
              select-none
            "
            aria-label="Go to History"
          >
            History
          </button>
        </div>

        <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-300 drop-shadow-lg select-none">
          Live Customer Traffic
        </h1>

        <div className="overflow-x-auto rounded-lg border border-indigo-700 shadow-lg bg-white">
          <table className="min-w-full divide-y divide-indigo-700 table-auto">
            <thead className="bg-gray-100">
              <tr>
                {['Store ID', 'Customers In', 'Customers Out', 'Timestamp'].map((header) => (
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
              {liveData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-indigo-500 italic select-none">
                    No live data available
                  </td>
                </tr>
              ) : (
                liveData.map(({ store_id, customers_in, customers_out, time_stamp }, i) => (
                  <tr
                    key={i}
                    className="hover:bg-indigo-100 transition-colors cursor-default select-text"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-indigo-900 font-medium">{store_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-indigo-900">{customers_in}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-indigo-900">{customers_out}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-indigo-700">{new Date(time_stamp).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
