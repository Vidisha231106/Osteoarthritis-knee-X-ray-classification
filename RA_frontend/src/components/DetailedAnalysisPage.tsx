import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export default function DetailedAnalysisPage() {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stages = [
    { value: 0, label: 'Grade 0 - Normal (KL 0)', color: 'green' },
    { value: 1, label: 'Grade 1 - Doubtful (KL 1)', color: 'blue' },
    { value: 2, label: 'Grade 2 - Mild (KL 2)', color: 'yellow' },
    { value: 3, label: 'Grade 3 - Moderate (KL 3)', color: 'orange' },
    { value: 4, label: 'Grade 4 - Severe (KL 4)', color: 'red' },
  ];

  const getDetailedInfo = async (stage: number) => {
    setLoading(true);
    setError(null);
    setAnalysis('');

    try {
      if (!GEMINI_API_KEY) {
        // Fallback to static content if no API key
        setAnalysis(getStaticStageInfo(stage));
        return;
      }

      const prompt = `Provide a detailed medical explanation about Osteoarthritis (knee) Kellgren-Lawrence Grade ${stage} in approximately 500 words. Include:
    1. Clinical characteristics and symptoms
    2. Radiological findings (osteophytes, joint space narrowing, sclerosis)
    3. Typical patient presentation
    4. Disease progression implications and functional impact
    5. Treatment approaches and management strategies (conservative, injections, surgical)

    Write in a professional medical tone suitable for healthcare providers.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch analysis from Gemini API');
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      setAnalysis(text || getStaticStageInfo(stage));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate analysis');
      setAnalysis(getStaticStageInfo(stage));
    } finally {
      setLoading(false);
    }
  };

  const getStaticStageInfo = (stage: number): string => {
        const stageInfo: Record<number, string> = {
      0: `**Grade 0 (KL 0): No Radiographic Osteoarthritis**

    Grade 0 indicates no radiographic evidence of osteoarthritis. Knee radiographs show preserved joint space without osteophytes, sclerosis, or joint deformity.

    **Clinical Characteristics:**
    Patients may be asymptomatic or have nonspecific knee discomfort not attributable to OA. There is no functional limitation related to osteoarthritis.

    **Radiological Findings:**
    Radiographs appear normal with well-preserved joint space and smooth joint margins. No osteophytes, subchondral sclerosis, or cysts are present.

    **Management:**
    No OA-specific therapy is required. Emphasize general joint health: weight management, exercise, and injury prevention.`,

      1: `**Grade 1 (KL 1): Doubtful**

    Grade 1 is characterized by doubtful joint space narrowing and possible osteophyte formation that may be subtle on radiographs.

    **Clinical Characteristics:**
    Patients may report intermittent knee pain, especially with activity, but signs and symptoms are often mild or nonspecific.

    **Radiological Findings:**
    Small, doubtful osteophytes may be present. Joint space narrowing is minimal or uncertain. Subchondral changes are typically absent.

    **Management:**
    Conservative measures: patient education, exercise programs (strengthening and low-impact aerobic), weight loss if overweight, and NSAIDs for symptomatic relief as needed. Monitor progression clinically and radiographically.`,

      2: `**Grade 2 (KL 2): Mild Osteoarthritis**

    Grade 2 shows definite osteophyte formation and possible joint space narrowing on radiographs.

    **Clinical Characteristics:**
    Patients typically have activity-related knee pain, stiffness after rest, and occasional swelling. Functional limitations are usually mild to moderate.

    **Radiological Findings:**
    Definite osteophytes at joint margins are visible; joint space narrowing may be present but not severe. Early subchondral sclerosis or cysts may be seen.

    **Management:**
    Nonoperative management is first-line: exercise and physical therapy, weight loss, analgesics/NSAIDs, activity modification, and consideration of intra-articular injections (e.g., corticosteroids or hyaluronic acid) for symptom control. Patient education about disease course is important.`,

      3: `**Grade 3 (KL 3): Moderate Osteoarthritis**

    Grade 3 demonstrates multiple osteophytes, definite joint space narrowing, some sclerosis, and possible deformity.

    **Clinical Characteristics:**
    Patients experience persistent knee pain with significant activity limitation. Stiffness and intermittent swelling are common; walking long distances may be impaired.

    **Radiological Findings:**
    Multiple osteophytes, definite narrowing of the joint space, subchondral sclerosis, and possible bone cysts or malalignment are evident.

    **Management:**
    Enhanced conservative care: structured physical therapy, bracing if indicated, targeted weight loss, and optimized analgesic strategies. Consider orthobiologic injections selectively. Referral to orthopedics for consideration of surgical options (arthroscopy is generally limited in OA) may be appropriate in refractory cases.`,

      4: `**Grade 4 (KL 4): Severe Osteoarthritis**

    Grade 4 indicates severe radiographic osteoarthritis with large osteophytes, marked joint space loss, severe sclerosis, and deformity.

    **Clinical Characteristics:**
    Patients have severe pain at rest and with activity, major functional impairment, and limited mobility. Quality of life is often substantially reduced.

    **Radiological Findings:**
    Large osteophytes, marked joint space narrowing or obliteration, significant subchondral sclerosis, bone cysts, and malalignment or deformity.

    **Management:**
    When conservative measures fail, surgical management such as total knee arthroplasty is commonly indicated to relieve pain and restore function. Preoperative optimization, multidisciplinary care, and postoperative rehabilitation are essential for good outcomes.`,
        };

        return stageInfo[stage] || 'Information not available.';
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Detailed Osteoarthritis (KL) Grade Analysis
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Select a grade below to view comprehensive medical information about knee osteoarthritis, radiographic findings, and management.
        </p>
      </div>

      {/* Stage Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Select KL Grade</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {stages.map((stage) => (
            <button
              key={stage.value}
              onClick={() => {
                setSelectedStage(stage.value);
                getDetailedInfo(stage.value);
              }}
              className={`
                p-4 rounded-lg border-2 transition-all duration-300 text-left
                ${
                  selectedStage === stage.value
                    ? 'border-teal-500 bg-teal-50 shadow-md scale-105'
                    : 'border-gray-200 bg-white hover:border-teal-300 hover:shadow-sm'
                }
              `}
            >
              <div className={`text-2xl font-bold mb-1 ${
                selectedStage === stage.value ? 'text-teal-600' : 'text-gray-700'
              }`}>
                {stage.value}
              </div>
              <div className={`text-sm ${
                selectedStage === stage.value ? 'text-teal-700' : 'text-gray-600'
              }`}>
                {stage.label.split(' - ')[1]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Display */}
      {loading && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Generating detailed analysis...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-8">
          <p className="text-red-700 text-center">{error}</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
            <Sparkles className="w-6 h-6 text-teal-500" />
            <h3 className="text-2xl font-bold text-gray-800">
              Stage {selectedStage} - Comprehensive Analysis
            </h3>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-700 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ 
                __html: analysis
                  .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                  .replace(/\n\n/g, '</p><p class="mb-4">')
                  .replace(/^/, '<p class="mb-4">')
                  .replace(/$/, '</p>')
              }}
            />
          </div>
        </div>
      )}

      {!selectedStage && !loading && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
          <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            Select a stage above to view detailed medical information
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800 text-center leading-relaxed">
          <strong className="font-semibold">Clinical Note:</strong> This information is for educational 
          purposes and clinical reference. Treatment decisions should be individualized based on patient 
          factors, comorbidities, and current clinical guidelines.
        </p>
      </div>
    </div>
  );
}
