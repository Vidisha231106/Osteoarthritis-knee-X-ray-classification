import { Activity, CheckCircle2, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-block mb-6 p-4 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full">
          <Activity className="w-16 h-16 text-teal-600" />
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
          RA Detection System
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
          Advanced AI-Powered Rheumatoid Arthritis Stage Detection
        </p>
        
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Our cutting-edge deep learning model analyzes X-ray images to accurately classify 
          rheumatoid arthritis severity stages, providing healthcare professionals with 
          rapid, reliable diagnostic support.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="bg-gradient-to-br from-teal-500 to-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Fast Analysis
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Get results in seconds with our optimized EfficientNet-B0 model using 
            CORAL ordinal regression for precise stage classification.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Clinically Meaningful
          </h3>
          <p className="text-gray-600 leading-relaxed">
            CORAL ordinal regression respects disease progression, penalizing 
            adjacent stage errors less than distant ones for clinical relevance.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            5-Stage Classification
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Comprehensive staging from normal (Stage 0) to severe RA (Stage 4) 
            with detailed explanations and confidence scores.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-teal-100 text-teal-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload X-ray</h3>
            <p className="text-gray-600">
              Upload a clear X-ray image of hand or wrist joints in PNG, JPG, or JPEG format.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-cyan-100 text-cyan-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Analysis</h3>
            <p className="text-gray-600">
              Our deep learning model processes the image and identifies RA stage markers.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Get Results</h3>
            <p className="text-gray-600">
              Review the predicted stage, severity level, confidence score, and detailed explanation.
            </p>
          </div>
        </div>
      </div>

      {/* Disease Stages Overview */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          RA Stages Detected
        </h2>
        
        <div className="space-y-3">
          {[
            { stage: 0, severity: 'Normal', color: 'green', description: 'No signs of RA detected' },
            { stage: 1, severity: 'Doubtful/Minimal', color: 'blue', description: 'Early possible signs' },
            { stage: 2, severity: 'Mild', color: 'yellow', description: 'Periarticular osteoporosis and early erosions' },
            { stage: 3, severity: 'Moderate', color: 'orange', description: 'Multiple erosions and joint space narrowing' },
            { stage: 4, severity: 'Severe', color: 'red', description: 'Extensive joint destruction and deformity' },
          ].map((item) => (
            <div
              key={item.stage}
              className="bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`bg-${item.color}-100 text-${item.color}-700 w-16 h-16 rounded-lg flex items-center justify-center font-bold text-xl flex-shrink-0`}>
                {item.stage}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-lg">{item.severity}</h4>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-center text-blue-800 text-sm leading-relaxed">
          <strong className="font-semibold">Medical Disclaimer:</strong> This tool is designed for research and 
          educational purposes to assist healthcare professionals. It should not be used as a substitute 
          for professional medical diagnosis, treatment, or advice. Always consult qualified healthcare 
          providers for medical decisions.
        </p>
      </div>
    </div>
  );
}
