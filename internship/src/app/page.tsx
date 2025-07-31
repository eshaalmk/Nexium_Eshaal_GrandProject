'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

const COLORS: Record<string, string> = {
  happy: '#FFD700',
  sad: '#6495ED',
  tired: '#A9A9A9',
  anxious: '#FF69B4',
  excited: '#7CFC00',
  angry: '#FF6347',
};

const fallbackColor = (index: number) =>
  ['#FFB6C1', '#ADD8E6', '#90EE90', '#FFA07A', '#DDA0DD'][index % 5];


// 🧠 Wellness Tips
const tips = {
  exercise: [
    "Take a 10-minute walk daily to boost mood.",
    "Stretch in the morning to wake up your body.",
    "Try a short yoga session to relieve stress.",
    "Dancing counts as exercise — play your favorite song!",
    "Consistency > intensity. Move a little every day.",
  ],
  sleep: [
    "Go to bed and wake up at the same time daily.",
    "Avoid screens 1 hour before sleep.",
    "Keep your room cool, dark, and quiet.",
    "Wind down with reading or meditation.",
    "Limit caffeine after 2 PM for deeper rest.",
  ],
  food: [
    "Stay hydrated — your brain needs water too!",
    "Eat more leafy greens for better focus.",
    "Avoid skipping meals — your mood depends on fuel.",
    "Omega-3s (like in nuts & fish) help regulate emotions.",
    "Limit sugar to avoid energy crashes.",
  ],
};

// 🧩 Tip Card
function TipCard({ title, tip, icon, color }: { title: string; tip: string; icon: string; color: string }) {
  return (
    <div
      className={`relative p-6 rounded-3xl shadow-lg bg-gradient-to-br ${color} bg-opacity-20 backdrop-blur-xl transition-transform hover:scale-[1.02] hover:shadow-2xl w-full max-w-sm flex-1 border border-white/10`}
    >
      {/* Light overlay glow blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      {/* Tip Text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={tip}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-sm text-gray-700 leading-relaxed"
        >
          {tip}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}


// 🎯 Tips Section
function WellnessTips() {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [sleepIndex, setSleepIndex] = useState(0);
  const [foodIndex, setFoodIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setExerciseIndex((prev) => (prev + 1) % tips.exercise.length);
      setSleepIndex((prev) => (prev + 1) % tips.sleep.length);
      setFoodIndex((prev) => (prev + 1) % tips.food.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-12 flex flex-row flex-wrap justify-center gap-6">
      <TipCard
        title="Exercise"
        icon="💪"
        tip={tips.exercise[exerciseIndex]}
        color="from-purple-300 to-purple-100"
      />
      <TipCard
        title="Sleep"
        icon="😴"
        tip={tips.sleep[sleepIndex]}
        color="from-blue-300 to-blue-100"
      />
      <TipCard
        title="Nutrition"
        icon="🥦"
        tip={tips.food[foodIndex]}
        color="from-green-300 to-green-100"
      />
    </div>
  );
}

// 🚀 Main Dashboard
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [insight, setInsight] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [moodCounts, setMoodCounts] = useState<Record<string, number>>({});


  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!data?.session || error) return router.push('/login');
      setUser(data.session.user);
      setLoading(false);
    };
    getSession();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleWeeklySummary = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return;

    const res = await fetch('/api/weekly-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();
    setSummary(data.summary);
    setInsight(data.insight);
    setMoodCounts(data.moodCounts || {}); 
    console.log(data.moodCounts);

    setShowSummary(true);
  };

  const goToMoodTracker = () => {
    router.push('/mood');
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </main>
    );
  }

return (
  <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-6 space-y-6">
    {showSummary ? (
      <>
        {/* Insight Card */}
        <div className="bg-white shadow-xl rounded-xl border border-gray-200 p-6 w-[24rem] animate-fadeIn z-10 relative">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <h2 className="text-lg font-semibold text-purple-800">Weekly Insight</h2>
          </div>
          <p className="text-gray-800 text-sm">{summary}</p>
          <p className="text-gray-600 text-sm italic mt-1">{insight}</p>

          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setShowSummary(false)}
              className="text-sm px-4 py-1 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
            >
              Close
            </button>
          </div>
        </div>

        {/* Mood Chart — completely outside summary box */}
        {Object.keys(moodCounts).length > 0 && (
          <div className="w-[24rem] h-[260px] bg-white/70 backdrop-blur-md rounded-xl p-4 shadow-md animate-fadeIn z-0">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">Mood Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(moodCounts).map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                 label={({ name, percent }) => {
                      const safePercent = percent ?? 0; // fallback to 0 if undefined
                      return `${name} (${(safePercent * 100).toFixed(0)}%)`;
                    }}
                >
                  {Object.entries(moodCounts).map(([name], index) => (
                    <Cell key={`cell-${name}`} fill={COLORS[name] || fallbackColor(index)} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </>
    )  : (
      <div className="bg-white shadow-xl rounded-3xl px-10 py-12 w-full max-w-6xl text-center animate-fadeIn">
        <h1 className="text-3xl font-bold text-purple-900 mb-4">Welcome back!</h1>
        <p className="text-md text-gray-800 mb-4">
          Logged in as <span className="font-semibold">{user?.email}</span>
        </p>
        <blockquote className="text-sm italic text-gray-600 mb-8">
         &quot;Every emotion is valid. Reflect, don&#39;t repress. 💜&quot;
        </blockquote>


        {/* Action Buttons */}
        <div className="flex justify-center flex-wrap gap-6">
          <button
            onClick={goToMoodTracker}
            className="w-40 h-40 bg-gradient-to-tr from-green-400 to-green-600 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-2"
          >
            📝 <span>Track Mood</span>
          </button>

          <button
            onClick={handleWeeklySummary}
            className="w-40 h-40 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-2"
          >
            📊 <span>Weekly Summary</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-40 h-40 bg-gradient-to-tr from-red-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-2"
          >
            🚪 <span>Logout</span>
          </button>
        </div>

        {/* 🌱 Rotating Tips Section */}
        <WellnessTips />
      </div>
    )}
  </main>
);

}
