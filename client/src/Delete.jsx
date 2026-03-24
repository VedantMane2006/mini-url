import { useState } from 'react';

export default function Delete({ onSubmit }) {
  const [shortCode, setShortCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!shortCode.trim()) {
      alert('Please enter a short code');
      return;
    }

    try {
      let result;

      // 🔥 If parent provides onSubmit → use it
      if (onSubmit) {
        result = await onSubmit(shortCode);
      } 
      // 🔥 Else fallback to your existing API
      else {
        const response = await fetch(`/api/url/${shortCode}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to delete short URL');
        }

        result = data;
      }

      // success handling
      setMessage(`✅ Short URL "${shortCode}" deleted successfully!`);
      setShortCode('');

    } catch (err) {
      console.error(err);
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
        <p className="text-red-400 text-sm flex items-center gap-2">
          <span className="font-bold">⚠️ Warning:</span>
          This action cannot be undone. The short URL will be permanently deleted.
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300">
          Short Code <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
          placeholder="abc123"
          className="w-full px-5 py-4 bg-gray-900/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all backdrop-blur-sm"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-linear-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-red-500/20"
      >
        Delete Short URL
      </button>

      {message && (
        <div className="text-center text-sm text-gray-300 mt-4">
          {message}
        </div>
      )}
    </div>
  );
}