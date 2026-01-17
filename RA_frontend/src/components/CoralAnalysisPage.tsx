import { useState } from 'react';
import UploadSection from './UploadSection';
import PreviewArea from './PreviewArea';
import AnalyzeButton from './AnalyzeButton';
import ResultsPanel from './ResultsPanel';
import Loader from './Loader';
import { Layers, TrendingUp, Info } from 'lucide-react';

interface AnalysisResult {
  grade: number;
  severity: string;
  confidence: number;
  explanation: string;
  model_type?: string;
  model_description?: string;
}

export default function CoralAnalysisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

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

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    const apiUrl = import.meta.env.VITE_API_URL || '';
    const endpoint = `${apiUrl}/predict/coral`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Analysis failed: ${response.statusText}`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to analyze image. Please ensure the backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      {loading && <Loader />}

      {/* Model Info Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Layers className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">CORAL Ordinal Regression Model</h2>
            <p className="text-teal-100 mb-4">
              EfficientNet-B0 backbone with Consistent Rank Logits (CORAL) ordinal regression
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Ordinal Classification:</span>
                  <span className="text-teal-100 ml-1">
                    Leverages the inherent order of KL grades (0 → 1 → 2 → 3 → 4), preventing illogical predictions
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">How it works:</span>
                  <span className="text-teal-100 ml-1">
                    Predicts cumulative probabilities P(y &gt; k) using sigmoid, then converts to class probabilities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Analyze with CORAL Model
        </h3>
        <p className="text-gray-600">
          Upload a knee X-ray image to classify using ordinal regression
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
              <AnalyzeButton
                onClick={handleAnalyze}
                disabled={!selectedFile}
                loading={loading}
              />
            </div>

            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fadeIn">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <ResultsPanel result={result} modelName="CORAL" accentColor="teal" />
          </>
        )}
      </div>
    </div>
  );
}
