'use client';

import { useEffect, useState } from 'react';

export default function SummaryPage() {
  const [summary, setSummary] = useState('');
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch('/api/weekly-summary');
        const data = await res.json();
        console.log('Received data:', data);
        setSummary(data.summary);
        setInsight(data.insight);
      } catch (err) {
        console.error('Failed to fetch summary', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-purple-800">Your Weekly Insight</h1>
      {loading ? (
        <p className="text-gray-600">Fetching insights...</p>
      ) : (
        <div className="p-6 bg-yellow-100 rounded-lg shadow-md">
          <p className="text-lg text-gray-800 mb-2">{summary}</p>
          <p className="italic text-gray-700">{insight}</p>
        </div>
      )}
    </main>
  );
}
