import { useState } from 'react';
import UploadSection from './UploadSection';
import PreviewArea from './PreviewArea';
import Loader from './Loader';
import { GitCompare, CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface ModelResult {
  grade: number;
  severity: string;
  confidence: number;
  explanation: string;
  model_type?: string;
  model_description?: string;
  probabilities?: Record<string, number>;
  error?: string;
}

interface ComparisonResult {
  coral: ModelResult | null;
  resnet: ModelResult | null;
  comparison: {
    grades_match: boolean;
    grade_difference: number;
    higher_confidence: string;
    coral_grade: number;
    resnet_grade: number;
    analysis: string;
  };
}

const SEVERITY_COLORS: Record<string, string> = {
  'Normal': 'bg-green-100 text-green-800 border-green-200',
  'Doubtful/Minimal': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Mild': 'bg-orange-100 text-orange-800 border-orange-200',
  'Moderate': 'bg-red-100 text-red-800 border-red-200',
  'Severe': 'bg-red-200 text-red-900 border-red-300',
};

export default function ComparisonPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  const handleFileSelect = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a PNG, JPG, or JPEG image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB. Please upload a smaller image.');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  };

  const handleCompare = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    const apiUrl = import.meta.env.VITE_API_URL || '';
    const endpoint = `${apiUrl}/predict/compare`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Comparison failed: ${response.statusText}`);
      }

      const data: ComparisonResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to compare models. Please ensure the backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderProbabilityBar = (probs: Record<string, number> | undefined, accentColor: string) => {
    if (!probs) return null;
    
    const grades = ['grade_0', 'grade_1', 'grade_2', 'grade_3', 'grade_4'];
    const labels = ['0', '1', '2', '3', '4'];
    const colorClass = accentColor === 'teal' 
      ? 'bg-gradient-to-r from-teal-400 to-cyan-400'
      : 'bg-gradient-to-r from-purple-400 to-indigo-400';
    
    return (
      <div className="space-y-2 mt-4">
        {grades.map((grade, idx) => (
          <div key={grade} className="flex items-center gap-2">
            <span className="text-xs text-gray-600 w-6">G{labels[idx]}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${colorClass}`}
                style={{ width: `${(probs[grade] || 0) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 w-12 text-right">
              {((probs[grade] || 0) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="animate-fadeIn">
      {loading && <Loader />}

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <GitCompare className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Model Comparison</h2>
            <p className="text-gray-300 mb-4">
              Upload an X-ray image to compare predictions from both CORAL and ResNet50 models
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-teal-500/30 px-3 py-1 rounded-full">
                <span className="w-3 h-3 rounded-full bg-teal-400"></span>
                <span>CORAL: Ordinal Regression</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-500/30 px-3 py-1 rounded-full">
                <span className="w-3 h-3 rounded-full bg-purple-400"></span>
                <span>ResNet50: Multiclass</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Compare Both Models
        </h3>
        <p className="text-gray-600">
          See how different classification approaches perform on the same image
        </p>
      </div>

      <div className="space-y-6">
        {!imagePreview ? (
          <UploadSection onFileSelect={handleFileSelect} error={error} />
        ) : (
          <>
            <PreviewArea
              imageUrl={imagePreview}
              fileName={selectedFile?.name || null}
              onRemove={handleRemoveImage}
            />

            <div className="flex justify-center">
              <button
                onClick={handleCompare}
                disabled={!selectedFile || loading}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-900 
                           text-white font-semibold rounded-xl shadow-lg hover:shadow-xl 
                           transform hover:scale-105 transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <GitCompare className="w-6 h-6" />
                <span>Compare Models</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fadeIn">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="animate-fadeIn space-y-6">
                {/* Comparison Summary */}
                {result.comparison && (
                  <div className={`rounded-xl p-6 ${
                    result.comparison.grades_match 
                      ? 'bg-green-50 border-2 border-green-200' 
                      : 'bg-amber-50 border-2 border-amber-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      {result.comparison.grades_match ? (
                        <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
                      )}
                      <div>
                        <h4 className={`text-xl font-bold mb-2 ${
                          result.comparison.grades_match ? 'text-green-800' : 'text-amber-800'
                        }`}>
                          {result.comparison.grades_match 
                            ? 'Models Agree!' 
                            : 'Models Disagree'}
                        </h4>
                        <p className={result.comparison.grades_match ? 'text-green-700' : 'text-amber-700'}>
                          {result.comparison.analysis}
                        </p>
                        {!result.comparison.grades_match && (
                          <p className="text-amber-600 text-sm mt-2">
                            Grade difference: {result.comparison.grade_difference} level(s) • 
                            Higher confidence: {result.comparison.higher_confidence === 'coral' ? 'CORAL' : 'ResNet50'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Side by Side Results */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* CORAL Result */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-teal-200">
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 text-white">
                      <h4 className="text-lg font-bold">CORAL Model</h4>
                      <p className="text-teal-100 text-sm">Ordinal Regression</p>
                    </div>
                    {result.coral && !result.coral.error ? (
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-3xl font-bold text-teal-600">
                            Grade {result.coral.grade}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                            SEVERITY_COLORS[result.coral.severity] || 'bg-gray-100 text-gray-800'
                          }`}>
                            {result.coral.severity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <div 
                              className="h-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400"
                              style={{ width: `${result.coral.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-teal-600">
                            {result.coral.confidence}%
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{result.coral.explanation}</p>
                        {result.coral.probabilities && (
                          <>
                            <h5 className="text-sm font-semibold text-gray-700">Grade Probabilities</h5>
                            {renderProbabilityBar(result.coral.probabilities, 'teal')}
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-red-500">
                        <XCircle className="w-8 h-8 mx-auto mb-2" />
                        <p>Failed to get CORAL prediction</p>
                      </div>
                    )}
                  </div>

                  {/* ResNet50 Result */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-purple-200">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 text-white">
                      <h4 className="text-lg font-bold">ResNet50 Model</h4>
                      <p className="text-purple-100 text-sm">Multiclass Classification</p>
                    </div>
                    {result.resnet && !result.resnet.error ? (
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-3xl font-bold text-purple-600">
                            Grade {result.resnet.grade}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                            SEVERITY_COLORS[result.resnet.severity] || 'bg-gray-100 text-gray-800'
                          }`}>
                            {result.resnet.severity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <div 
                              className="h-3 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400"
                              style={{ width: `${result.resnet.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-purple-600">
                            {result.resnet.confidence}%
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{result.resnet.explanation}</p>
                        {result.resnet.probabilities && (
                          <>
                            <h5 className="text-sm font-semibold text-gray-700">Grade Probabilities</h5>
                            {renderProbabilityBar(result.resnet.probabilities, 'purple')}
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-red-500">
                        <XCircle className="w-8 h-8 mx-auto mb-2" />
                        <p>Failed to get ResNet50 prediction</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Model Comparison Info */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Understanding the Differences</h4>
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h5 className="font-semibold text-teal-600 mb-2">CORAL Ordinal Regression</h5>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Understands that Grade 2 is between 1 and 3</li>
                        <li>• More consistent severity predictions</li>
                        <li>• Uses cumulative probability thresholds</li>
                        <li>• Better for clinical progression tracking</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-purple-600 mb-2">ResNet50 Multiclass</h5>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Treats each grade as independent class</li>
                        <li>• Standard deep learning approach</li>
                        <li>• Uses softmax probability distribution</li>
                        <li>• May have higher variance in predictions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
