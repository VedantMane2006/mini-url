import { useState } from 'react';

export default function Update({ onSubmit }) {
  const [shortCode, setShortCode] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!shortCode.trim() || !originalUrl.trim()) {
      alert('Please fill in both fields');
      return;
    }

    try {
      let result;

      // 🔥 If parent provides onSubmit → use it
      if (onSubmit) {
        result = await onSubmit(shortCode, originalUrl);
      } 
      // 🔥 Else fallback to your existing API
      else {
        const response = await fetch(`/api/url/${shortCode}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ originalUrl }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to update short URL');
        }

        result = data;
      }

      // success handling (works for both cases)
      setMessage(`✅ Short URL "${shortCode}" updated successfully!`);
      setShortCode('');
      setOriginalUrl('');

    } catch (err) {
      console.error(err);
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300">
          Short Code <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
          placeholder="abc123"
          className="w-full px-5 py-4 bg-gray-900/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300">
          New Original URL <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="https://example.com/new-destination-url"
          className="w-full px-5 py-4 bg-gray-900/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-linear-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/20"
      >
        Update Short URL
      </button>

      {message && (
        <div className="text-center text-sm text-gray-400 mt-4">
          {message}
        </div>
      )}
    </div>
  );
}