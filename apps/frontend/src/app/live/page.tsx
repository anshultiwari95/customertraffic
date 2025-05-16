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
    // First fetch existing live data
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

    // Then connect WebSocket to backend running on port 4000
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
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between mb-6">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Home
        </button>
        <button
          onClick={() => router.push('/history')}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-blue-700 transition"
        >
          History
        </button>
      </div>

      <h1 className="text-2xl font-semibold mb-4">Live Customer Traffic</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Store ID</th>
            <th className="border border-gray-300 p-2 text-left">Customers In</th>
            <th className="border border-gray-300 p-2 text-left">Customers Out</th>
            <th className="border border-gray-300 p-2 text-left">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {liveData.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4">No live data available</td>
            </tr>
          ) : (
            liveData.map(({ store_id, customers_in, customers_out, time_stamp }, i) => (
              <tr key={i} className="even:bg-gray-50">
                <td className="border border-gray-300 p-2">{store_id}</td>
                <td className="border border-gray-300 p-2">{customers_in}</td>
                <td className="border border-gray-300 p-2">{customers_out}</td>
                <td className="border border-gray-300 p-2">{time_stamp}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
