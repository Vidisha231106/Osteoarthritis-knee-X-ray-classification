import { useState } from 'react';
import UploadSection from './UploadSection';
import PreviewArea from './PreviewArea';
import AnalyzeButton from './AnalyzeButton';
import ResultsPanel from './ResultsPanel';
import Loader from './Loader';

interface AnalysisResult {
  grade: number;
  severity: string;
  confidence: number;
  explanation: string;
}

export default function AnalyzePage() {
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

    // Use API URL from environment variable or default to local proxy
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const endpoint = `${apiUrl}/predict`;

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
          : 'Failed to analyze image. Please ensure the backend server is running on port 5000.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      {loading && <Loader />}

      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          X-ray Image Analysis
        </h2>
        <p className="text-gray-600 text-lg">
          Upload a knee X-ray image to detect and classify osteoarthritis using the Kellgren-Lawrence grading system
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

            <ResultsPanel result={result} />
          </>
        )}
      </div>
    </div>
  );
}
