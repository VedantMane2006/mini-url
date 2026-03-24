import { Plus, Search, Edit, Trash2, TrendingUp } from 'lucide-react';

function TabNavigation({ activeTab, setActiveTab, clearMessages }) {
  const tabs = [
    { id: 'create', label: 'Create', icon: Plus, color: 'cyan' },
    { id: 'retrieve', label: 'Retrieve', icon: Search, color: 'blue' },
    { id: 'update', label: 'Update', icon: Edit, color: 'purple' },
    { id: 'delete', label: 'Delete', icon: Trash2, color: 'red' },
    { id: 'stats', label: 'Statistics', icon: TrendingUp, color: 'emerald' }
  ];

  return (
    <div className="flex flex-wrap gap-2 p-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              clearMessages();
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === tab.id
                ? `bg-linear-to-br from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg shadow-${tab.color}-500/30`
                : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default TabNavigation;