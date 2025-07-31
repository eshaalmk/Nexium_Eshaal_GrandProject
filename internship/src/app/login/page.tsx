'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabaseClient';

export default function Home() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMessage('❌ ' + error.message);
    else setMessage('✅ Magic link sent! Check your email.');
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-blue-200 overflow-hidden p-6 font-sans">

      {/* Background blobs */}
      <div className="absolute w-96 h-96 bg-purple-400 rounded-full blur-[120px] opacity-30 top-[-100px] left-[-100px] animate-pulse -z-10" />
      <div className="absolute w-96 h-96 bg-blue-400 rounded-full blur-[120px] opacity-30 bottom-[-100px] right-[-100px] animate-pulse delay-1000 -z-10" />


      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/30 backdrop-blur-2xl shadow-xl rounded-3xl p-10 w-full max-w-lg text-center border border-white/40"
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-extrabold text-purple-800 drop-shadow-sm"
        >
          Nexium Mood Tracker
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-2 mb-4 text-lg text-gray-700"
        >
          Your mental wellness companion built with ❤️
        </motion.p>

        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="italic text-sm text-gray-600 mb-8"
        >
          &quot;It&#39;s okay to not be okay. You&#39;re taking the first step.&quot;
        </motion.blockquote>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col gap-4"
        >
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg border border-purple-300 bg-white/70 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />
          <button
            onClick={handleLogin}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
          >
            Send Magic Link
          </button>
        </motion.div>

        {/* Status */}
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-center text-sm mt-4 text-gray-800"
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </main>
  );
}
