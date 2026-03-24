import { useState } from 'react';

export default function Retrieve({ onSubmit }) {
  const [searchCode, setSearchCode] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
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
        const response = await fetch(`/api/url/${searchCode}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Short URL not found');
        }

        result = data;
      }

      // works for both cases
      if (result?.data?.originalUrl) {
        setOriginalUrl(result.data.originalUrl);
        setMessage('');
      } else if (result?.originalUrl) {
        // in case parent returns simplified object
        setOriginalUrl(result.originalUrl);
        setMessage('');
      }

    } catch (err) {
      console.error(err);
      setOriginalUrl('');
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
          className="w-full px-5 py-4 bg-gray-900/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-linear-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/20"
      >
        Retrieve Original URL
      </button>

      {originalUrl && (
        <div className="text-center mt-6">
          <p className="text-gray-300 mb-2">Original URL:</p>
          <a
            href={originalUrl}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 font-semibold underline break-all"
          >
            {originalUrl}
          </a>
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