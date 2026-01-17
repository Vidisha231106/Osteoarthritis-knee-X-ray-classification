import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface AnalysisResult {
  grade: number;
  severity: string;
  confidence: number;
  explanation: string;
  model_type?: string;
  model_description?: string;
}

interface ResultsPanelProps {
  result: AnalysisResult | null;
  modelName?: string;
  accentColor?: 'teal' | 'purple';
}

export default function ResultsPanel({ result, modelName = 'AI', accentColor = 'teal' }: ResultsPanelProps) {
  if (!result) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'normal':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'doubtful/minimal':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'mild':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'moderate':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'severe':
        return 'text-red-700 bg-red-100 border-red-300';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'normal':
        return <CheckCircle className="w-6 h-6" />;
      case 'doubtful/minimal':
      case 'mild':
        return <Info className="w-6 h-6" />;
      case 'moderate':
      case 'severe':
        return <AlertCircle className="w-6 h-6" />;
      default:
        return <Info className="w-6 h-6" />;
    }
  };

  const accentClasses = {
    teal: {
      gradeBg: 'bg-teal-50 border-teal-200',
      gradeText: 'text-teal-600',
      barBg: 'bg-teal-600',
    },
    purple: {
      gradeBg: 'bg-purple-50 border-purple-200',
      gradeText: 'text-purple-600',
      barBg: 'bg-purple-600',
    },
  };

  const accent = accentClasses[accentColor];
  const confidencePercentage = Math.round(result.confidence);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Analysis Results</h2>
      {result.model_type && (
        <p className="text-sm text-gray-500 mb-6">Model: {result.model_type}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`rounded-lg p-4 border ${accent.gradeBg}`}>
          <p className="text-sm text-gray-600 mb-1">KL Grade</p>
          <p className={`text-3xl font-bold ${accent.gradeText}`}>Grade {result.grade}</p>
        </div>

        <div className={`rounded-lg p-4 border ${getSeverityColor(result.severity)}`}>
          <p className="text-sm mb-1">Severity</p>
          <div className="flex items-center gap-2">
            {getSeverityIcon(result.severity)}
            <p className="text-xl font-bold capitalize">{result.severity}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Confidence</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`${accent.barBg} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${confidencePercentage}%` }}
              ></div>
            </div>
            <p className="text-xl font-bold text-gray-800">{confidencePercentage}%</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Explanation</h3>
        <p className="text-gray-700 leading-relaxed">{result.explanation}</p>
      </div>

      {result.model_description && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">About {modelName} Model</h4>
          <p className="text-sm text-gray-600">{result.model_description}</p>
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This analysis is for informational purposes only and should not replace professional medical diagnosis. For osteoarthritis management and treatment decisions, consult an orthopedic specialist or rheumatologist.
        </p>
      </div>
    </div>
  );
}
