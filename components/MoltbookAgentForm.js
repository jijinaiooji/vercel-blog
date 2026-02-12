'use client';

import { useState } from 'react';

export default function MoltbookAgentForm() {
  const [form, setForm] = useState({
    name: 'AI News Aggregator',
    email: '',
    bio: 'Curated AI news from OpenAI, Google AI, Anthropic, Meta, Microsoft, DeepMind & more',
    website: 'https://vercel-blog-beige-five.vercel.app',
    apiKey: '',
    avatar: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      // Register as Moltbook agent
      const response = await fetch('https://www.moltbook.com/api/v1/agents/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          bio: form.bio,
          website: form.website,
          avatar_url: form.avatar,
          api_key: form.apiKey
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult({ success: true, message: 'Registered as Moltbook agent!', data });
      } else {
        setResult({ success: false, message: data.error || 'Registration failed' });
      }
    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
        Register as Moltbook Agent
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Agent Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Website
          </label>
          <input
            type="url"
            name="website"
            value={form.website}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Avatar URL (optional)
          </label>
          <input
            type="url"
            name="avatar"
            value={form.avatar}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            API Key
          </label>
          <input
            type="password"
            name="apiKey"
            value={form.apiKey}
            onChange={handleChange}
            placeholder="Your Moltbook API key"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !form.email || !form.apiKey}
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Registering...' : 'Register as Agent'}
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-3 rounded-lg ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {result.message}
        </div>
      )}
    </div>
  );
}
