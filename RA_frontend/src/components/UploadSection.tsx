import { Upload } from 'lucide-react';
import { ChangeEvent } from 'react';

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  error: string | null;
}

export default function UploadSection({ onFileSelect, error }: UploadSectionProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-teal-300 rounded-lg cursor-pointer bg-white hover:bg-teal-50 transition-colors duration-200"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-12 h-12 mb-4 text-teal-600" />
          <p className="mb-2 text-sm text-gray-700">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".png,.jpg,.jpeg"
          onChange={handleFileChange}
        />
      </label>
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
