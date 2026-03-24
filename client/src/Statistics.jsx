import { useState } from 'react';

export default function Statistics({ onSubmit }) {
  const [searchCode, setSearchCode] = useState('');
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!searchCode.trim()) {
      alert('Please enter a short code');
      return;
    }

    try {
      let result;

      // 🔥 If parent provides onSubmit → use it
      if (onSubmit) {
        result = await onSubmit(searchCode);
      } 
      // 🔥 Else fallback to your existing API
      else {
        const response = await fetch(`/api/stats/${searchCode}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch statistics');
        }

        result = data;
      }

      // works for both cases
      if (result?.data) {
        setStats(result.data);
        setMessage('');
      } else if (result) {
        setStats(result); // in case parent sends direct object
        setMessage('');
      }

    } catch (err) {
      console.error(err);
      setStats(null);
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
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          placeholder="abc123"
          className="w-full px-5 py-4 bg-gray-900/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-linear-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-500/20"
      >
        Get Statistics
      </button>

      {stats && (
        <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-300 space-y-2">
          <p>
            <span className="font-semibold text-gray-200">Original URL:</span>{' '}
            {stats.originalUrl}
          </p>
          <p>
            <span className="font-semibold text-gray-200">Created At:</span>{' '}
            {new Date(stats.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold text-gray-200">Visits:</span>{' '}
            {stats.clicks}
          </p>
          <p>
            Go to Short URL:{' '}
            <a
              href={`/r/${stats.shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 underline"
            >
              {`${window.location.origin}/r/${stats.shortCode}`}
            </a>
          </p>
        </div>
      )}

      {message && (
        <div className="text-center text-sm text-gray-400 mt-4">
          {message}
        </div>
      )}
    </div>
  );
}