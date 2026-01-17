import { X } from 'lucide-react';

interface PreviewAreaProps {
  imageUrl: string | null;
  fileName: string | null;
  onRemove: () => void;
}

export default function PreviewArea({ imageUrl, fileName, onRemove }: PreviewAreaProps) {
  if (!imageUrl) return null;

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Image Preview</h3>
        <button
          onClick={onRemove}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="Remove image"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div className="relative rounded-lg overflow-hidden bg-gray-50">
        <img
          src={imageUrl}
          alt="X-ray preview"
          className="w-full h-auto max-h-96 object-contain"
        />
      </div>
      <p className="mt-3 text-sm text-gray-600 truncate">{fileName}</p>
    </div>
  );
}
