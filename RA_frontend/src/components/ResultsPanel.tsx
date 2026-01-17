import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface AnalysisResult {
  grade: number;
  severity: string;
  confidence: number;
  explanation: string;
}

interface ResultsPanelProps {
  result: AnalysisResult | null;
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  if (!result) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'normal':
      case 'mild':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'severe':
      case 'very severe':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'normal':
      case 'mild':
        return <CheckCircle className="w-6 h-6" />;
      case 'moderate':
        return <Info className="w-6 h-6" />;
      case 'severe':
      case 'very severe':
        return <AlertCircle className="w-6 h-6" />;
      default:
        return <Info className="w-6 h-6" />;
    }
  };

  const confidencePercentage = Math.round(result.confidence * 100);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
          <p className="text-sm text-gray-600 mb-1">RA Stage</p>
          <p className="text-3xl font-bold text-teal-600">Stage {result.grade}</p>
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
                className="bg-teal-600 h-2 rounded-full transition-all duration-500"
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

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This analysis is for informational purposes only and should not replace professional medical diagnosis. Please consult with a healthcare provider for proper evaluation.
        </p>
      </div>
    </div>
  );
}
