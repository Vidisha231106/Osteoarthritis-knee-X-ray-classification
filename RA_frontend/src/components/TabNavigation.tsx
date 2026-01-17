import { Home, Scan, Layers, GitCompare } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'home' | 'coral' | 'resnet' | 'compare';
  onTabChange: (tab: 'home' | 'coral' | 'resnet' | 'compare') => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'coral' as const, label: 'CORAL Analysis', icon: Scan },
    { id: 'resnet' as const, label: 'ResNet50 Analysis', icon: Layers },
    { id: 'compare' as const, label: 'Compare Models', icon: GitCompare },
  ];

  return (
    <nav className="bg-white shadow-md rounded-lg mb-8">
      <div className="flex flex-wrap">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex-1 min-w-[120px] flex items-center justify-center gap-2 py-4 px-4
                font-medium text-sm transition-all duration-300
                ${index > 0 ? 'border-l border-gray-200' : ''}
                ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }
                ${index === 0 ? 'rounded-tl-lg sm:rounded-l-lg sm:rounded-tl-lg' : ''}
                ${index === tabs.length - 1 ? 'rounded-tr-lg sm:rounded-r-lg sm:rounded-tr-lg' : ''}
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden text-xs">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
