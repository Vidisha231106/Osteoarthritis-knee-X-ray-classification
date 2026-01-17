import { useState } from 'react';
import { Activity } from 'lucide-react';
import TabNavigation from './components/TabNavigation';
import HomePage from './components/HomePage';
import CoralAnalysisPage from './components/CoralAnalysisPage';
import ResNetAnalysisPage from './components/ResNetAnalysisPage';
import ComparisonPage from './components/ComparisonPage';

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'coral' | 'resnet' | 'compare'>('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-12 h-12 text-teal-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Osteoarthritis Knee X-ray Classifier
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            AI-Powered Osteoarthritis (Kellgren-Lawrence) Knee X-ray Classification
          </p>
        </header>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'home' && <HomePage />}
          {activeTab === 'coral' && <CoralAnalysisPage />}
          {activeTab === 'resnet' && <ResNetAnalysisPage />}
          {activeTab === 'compare' && <ComparisonPage />}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p className="mb-2">Medical image analysis powered by advanced AI technology</p>
          <p>Always consult with healthcare professionals for medical decisions</p>
          <p className="mt-4 text-xs text-gray-400">
            © 2026 Osteoarthritis Knee X-ray Classifier • Dual Model: CORAL + ResNet50
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
