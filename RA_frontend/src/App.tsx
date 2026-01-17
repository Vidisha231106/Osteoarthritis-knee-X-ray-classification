import { useState } from 'react';
import { FileX2 } from 'lucide-react';
import UploadSection from './components/UploadSection';
import PreviewArea from './components/PreviewArea';
import AnalyzeButton from './components/AnalyzeButton';
import ResultsPanel from './components/ResultsPanel';
import Loader from './components/Loader';

interface AnalysisResult {
  grade: number;
  severity: string;
  confidence: number;
  explanation: string;
}

function App() {
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

    try {
      // Use relative URL - Vite proxy will forward to backend
      const response = await fetch('/predict', {
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50">
      {loading && <Loader />}

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileX2 className="w-10 h-10 text-teal-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Medical Image Analyzer
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            AI-powered Rheumatoid Arthritis stage detection from X-ray images
          </p>
        </header>

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

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Medical image analysis powered by advanced AI technology</p>
          <p className="mt-2">Always consult with healthcare professionals for medical decisions</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
