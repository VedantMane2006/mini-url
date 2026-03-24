import { useState } from 'react';
import { Link2 } from 'lucide-react';
import Create from './Create';
import Retrieve from './Retrieve';
import Update from './Update';
import Delete from './Delete';
import Statistics from './Statistics';
import URLList from './URLList';
import TabNavigation from './TabNavigation';

export default function App() {
  const [activeTab, setActiveTab] = useState('create');
  const [urls, setUrls] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const handleCreate = (originalUrl, customCode) => {
    setError('');
    setResult(null);

    if (!originalUrl) {
      setError('Please enter a URL');
      return;
    }

    try {
      new URL(originalUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    const shortCode = customCode || generateShortCode();
    
    if (urls[shortCode]) {
      setError('This short code already exists. Please choose another.');
      return;
    }

    const newUrl = {
      original: originalUrl,
      short: shortCode,
      created: new Date().toISOString(),
      clicks: 0
    };

    setUrls({ ...urls, [shortCode]: newUrl });
    setResult({ type: 'create', data: newUrl });
  };

  const handleRetrieve = (searchCode) => {
    setError('');
    setResult(null);

    if (!searchCode) {
      setError('Please enter a short code');
      return;
    }

    const urlData = urls[searchCode];
    if (urlData) {
      setResult({ type: 'retrieve', data: urlData });
    } else {
      setError('Short URL not found');
    }
  };

  const handleUpdate = (shortCode, originalUrl) => {
    setError('');
    setResult(null);

    if (!shortCode || !originalUrl) {
      setError('Please enter both short code and new URL');
      return;
    }

    if (!urls[shortCode]) {
      setError('Short code not found');
      return;
    }

    try {
      new URL(originalUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    const updated = {
      ...urls[shortCode],
      original: originalUrl,
      updated: new Date().toISOString()
    };

    setUrls({ ...urls, [shortCode]: updated });
    setResult({ type: 'update', data: updated });
  };

  const handleDelete = (code) => {
    setError('');
    const newUrls = { ...urls };
    delete newUrls[code];
    setUrls(newUrls);
    setResult({ type: 'delete', data: { short: code } });
  };

  const handleStats = (code) => {
    setError('');
    setResult(null);
    
    const urlData = urls[code];
    if (urlData) {
      setResult({ type: 'stats', data: urlData });
    } else {
      setError('Short URL not found');
    }
  };

  const simulateClick = (code) => {
    if (urls[code]) {
      const updated = { ...urls[code], clicks: urls[code].clicks + 1 };
      setUrls({ ...urls, [code]: updated });
    }
  };

  const clearMessages = () => {
    setError('');
    setResult(null);
  };

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-slate-900 to-gray-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="relative z-10 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 mt-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-br from-cyan-500 to-blue-500 blur-xl opacity-50"></div>
                  <Link2 className="relative w-14 h-14 text-cyan-400" strokeWidth={2.5} />
                </div>
                <h1 className="relative text-6xl font-extrabold bg-linear-to-br from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  LinkForge
                </h1>
              </div>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Craft powerful short links with precision • Track engagement • Manage effortlessly
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="h-1 w-12 bg-linear-to-br from-transparent via-cyan-500 to-transparent rounded-full"></div>
                <div className="h-1 w-8 bg-linear-to-br from-transparent via-blue-500 to-transparent rounded-full"></div>
                <div className="h-1 w-12 bg-linear-to-br from-transparent via-purple-500 to-transparent rounded-full"></div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
              <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 p-1">
                <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} clearMessages={clearMessages} />
              </div>

              <div className="p-10">
                {activeTab === 'create' && <Create onSubmit={handleCreate} />}
                {activeTab === 'retrieve' && <Retrieve onSubmit={handleRetrieve} />}
                {activeTab === 'update' && <Update onSubmit={handleUpdate} />}
                {activeTab === 'delete' && <Delete onSubmit={handleDelete} />}
                {activeTab === 'stats' && <Statistics onSubmit={handleStats} />}

                {error && (
                  <div className="mt-8 p-5 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <p className="text-red-400 font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {result && (
                  <div className="mt-8 p-6 bg-linear-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <h3 className="font-bold text-emerald-400 text-lg">
                        {result.type === 'create' && '✓ Short URL Created Successfully!'}
                        {result.type === 'retrieve' && '✓ Original URL Retrieved'}
                        {result.type === 'update' && '✓ Short URL Updated Successfully!'}
                        {result.type === 'delete' && '✓ Short URL Deleted Successfully!'}
                        {result.type === 'stats' && '📊 URL Statistics'}
                      </h3>
                    </div>
                    {result.data && result.type !== 'delete' && (
                      <div className="space-y-3 pl-5">
                        <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                          <span className="text-gray-400 font-medium">Short Code</span>
                          <span className="font-mono font-bold text-cyan-400 text-lg">{result.data.short}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                          <span className="text-gray-400 font-medium">Original URL</span>
                          <span className="font-mono text-gray-300 truncate ml-4 max-w-sm">{result.data.original}</span>
                        </div>
                        {result.type === 'stats' && (
                          <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                            <span className="text-gray-400 font-medium">Total Clicks</span>
                            <span className="font-bold text-purple-400 text-xl">{result.data.clicks}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                          <span className="text-gray-400 font-medium">Created</span>
                          <span className="text-gray-300">{new Date(result.data.created).toLocaleString()}</span>
                        </div>
                        {result.data.updated && (
                          <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                            <span className="text-gray-400 font-medium">Last Updated</span>
                            <span className="text-gray-300">{new Date(result.data.updated).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {Object.keys(urls).length > 0 && (
              <URLList 
                urls={urls} 
                onDelete={handleDelete} 
                onStats={handleStats} 
                onSimulateClick={simulateClick}
                setActiveTab={setActiveTab}
              />
            )}

            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">Built with React + Tailwind CSS</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}