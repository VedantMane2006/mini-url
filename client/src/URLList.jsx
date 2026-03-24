import { useState } from 'react';

function URLList({ urls, onDelete, onStats, onSimulateClick, setActiveTab }) {
  const { TrendingUp, Trash2, MousePointerClick, ExternalLink } = require('lucide-react');

  return (
    <div className="mt-12 bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-linear-to-b from-cyan-500 to-blue-500 rounded-full"></div>
        <h2 className="text-3xl font-bold text-gray-100">All Short URLs</h2>
        <div className="ml-auto px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <span className="text-cyan-400 font-bold">{Object.keys(urls).length}</span>
          <span className="text-gray-400 ml-2">total</span>
        </div>
      </div>
      <div className="space-y-4">
        {Object.entries(urls).map(([code, data]) => (
          <div key={code} className="group bg-gray-900/40 border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-cyan-400 text-lg px-3 py-1 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                    {code}
                  </span>
                  <span className="text-gray-600">→</span>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <ExternalLink className="w-4 h-4 text-gray-500 shrink-0" />
                    <span className="text-gray-300 truncate">{data.original}</span>
                  </div>
                </div>
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 font-semibold">{data.clicks}</span>
                    <span className="text-gray-500">clicks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                    <span className="text-gray-500">Created {new Date(data.created).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onSimulateClick(code)}
                  className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all font-medium text-sm"
                  title="Simulate Click"
                >
                  Test
                </button>
                <button
                  onClick={() => {
                    onStats(code);
                    setActiveTab('stats');
                  }}
                  className="p-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all"
                  title="View Statistics"
                >
                  <TrendingUp className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(code)}
                  className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
                  title="Delete URL"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default URLList;