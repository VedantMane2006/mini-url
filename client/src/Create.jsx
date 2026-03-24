import { useState } from 'react';

export default function Create({ onSubmit }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async () => {
    if (!originalUrl.trim()) {
      alert('Please enter a valid URL');
      return;
    }

    try {
      let result;

      // 🔥 If parent passed onSubmit → use it
      if (onSubmit) {
        result = await onSubmit(originalUrl, customCode);
      } 
      // 🔥 Else fallback to your original API call
      else {
        const response = await fetch('/api/shorten', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ originalUrl, customCode }),
        });

        if (!response.ok) {
          throw new Error('Failed to create short URL');
        }

        result = await response.json();
      }

      // works for both cases
      if (result?.shortUrl) {
        setShortUrl(result.shortUrl);
      }

      setOriginalUrl('');
      setCustomCode('');
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300">
          Original URL <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="https://example.com/your-very-long-url-here"
          className="w-full px-5 py-4 bg-gray-900/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300">
          Custom Short Code <span className="text-gray-500">(optional)</span>
        </label>
        <input
          type="text"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          placeholder="my-custom-link"
          className="w-full px-5 py-4 bg-gray-900/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
        />
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
          Leave empty to auto-generate a unique code
        </p>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20"
      >
        Create Short URL
      </button>

      {shortUrl && (
        <div className="text-center mt-6">
          <p className="text-gray-300 mb-2">Your short URL:</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 font-semibold underline break-all"
          >
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}