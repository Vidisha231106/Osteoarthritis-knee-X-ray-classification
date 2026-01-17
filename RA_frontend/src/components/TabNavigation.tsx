import { Home, Scan, FileText } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'home' | 'analyze' | 'details';
  onTabChange: (tab: 'home' | 'analyze' | 'details') => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'analyze' as const, label: 'Analyze', icon: Scan },
    { id: 'details' as const, label: 'Detailed Analysis', icon: FileText },
  ];

  return (
    <nav className="bg-white shadow-md rounded-lg mb-8">
      <div className="flex">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-4 px-6
                font-medium text-sm md:text-base transition-all duration-300
                ${index > 0 ? 'border-l border-gray-200' : ''}
                ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }
                ${index === 0 ? 'rounded-l-lg' : ''}
                ${index === tabs.length - 1 ? 'rounded-r-lg' : ''}
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
