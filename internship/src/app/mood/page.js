'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient'; 
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

export default function MoodTracker() {
  const [mood, setMood] = useState('');
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [entries, setEntries] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('moods').insert([
      {
        user_id: user.id,
        mood,
        intensity,
        note,
      },
    ]);

    if (error) {
      console.error(error);
      setMessage('Error saving mood.');
    } else {
      setMessage('Mood saved!');
      setMood('');
      setNote('');
      fetchMoods(); // reload
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const fetchMoods = async () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .gte('created_at', oneWeekAgo.toISOString())
      .order('created_at', { ascending: false });

    if (!error) setEntries(data);
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const getMoodColor = (mood) => {
    const colors = {
      happy: '#facc15',     // yellow
      sad: '#60a5fa',       // blue
      tired: '#9ca3af',     // gray
      anxious: '#f87171',   // red
      angry: '#ef4444',     // deeper red
      grateful: '#34d399',  // green
      default: '#a78bfa',   // purple
    };
    return colors[mood.toLowerCase()] || colors.default;
  };

  return (
    <main className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Mood Tracker</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Mood (e.g. happy, tired)"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          min="1"
          max="5"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Add a note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
        {message && <p className="text-sm">{message}</p>}
      </form>

      <div className="pt-6">
        <h2 className="text-xl font-semibold mb-2">Recent Entries</h2>
        <ul className="space-y-2">
          {entries.slice(0, 3).map(entry => (
            <li key={entry.id} className="p-3 border rounded bg-white">
              <strong>{entry.mood}</strong> ({entry.intensity}/5) — {entry.note}
              <div className="text-xs text-gray-500">{new Date(entry.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>

      {entries.length > 0 && (
        <div className="pt-10">
          <h2 className="text-xl font-semibold mb-2">Weekly Mood Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={entries.slice().reverse()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="created_at"
                tickFormatter={(str) => {
                  const date = new Date(str);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis domain={[0, 5]} />
              <Tooltip
                    content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                        const entry = payload[0].payload;
                        const date = new Date(label).toDateString();
                        return (
                            <div className="bg-white p-2 border rounded shadow text-sm">
                            <div><strong>{entry.mood}</strong></div>
                            <div>Intensity: {entry.intensity}/5</div>
                            <div className="text-gray-500">{date}</div>
                            </div>
                        );
                    }
                    return null;
                }}
            />

              <Bar
                dataKey="intensity"
                radius={[4, 4, 0, 0]}
                label={{ position: 'top', fontSize: 12 }}
              >
                {entries.slice().reverse().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getMoodColor(entry.mood)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </main>
  );
}
