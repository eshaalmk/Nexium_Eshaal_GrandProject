'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!session) {
          router.push('/login');
        } else {
          setUser(session.user);
        }
      } catch (err) {
        console.error('Session error:', err.message);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err.message);
      alert('Failed to log out. Try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
        <div className="text-lg text-gray-600 animate-pulse">Checking session...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-blue-100 to-purple-200 text-center p-8">
      <h1 className="text-4xl font-bold text-purple-800">Welcome back!</h1>
      <p className="text-lg text-gray-700">
        You are logged in as <strong>{user?.email ?? 'Unknown User'}</strong>
      </p>
      <button
        onClick={handleLogout}
        className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition-all duration-200"
      >
        Logout
      </button>
    </main>
  );
}
