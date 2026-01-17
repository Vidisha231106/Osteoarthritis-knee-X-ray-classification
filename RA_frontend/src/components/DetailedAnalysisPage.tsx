import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export default function DetailedAnalysisPage() {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stages = [
    { value: 0, label: 'Stage 0 - Normal', color: 'green' },
    { value: 1, label: 'Stage 1 - Doubtful/Minimal', color: 'blue' },
    { value: 2, label: 'Stage 2 - Mild', color: 'yellow' },
    { value: 3, label: 'Stage 3 - Moderate', color: 'orange' },
    { value: 4, label: 'Stage 4 - Severe', color: 'red' },
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

      const prompt = `Provide a detailed medical explanation about Rheumatoid Arthritis Stage ${stage} in approximately 500 words. Include:
1. Clinical characteristics and symptoms
2. Radiological findings (joint space, erosions, deformity)
3. Typical patient presentation
4. Disease progression implications
5. Treatment approaches and management strategies

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
      0: `**Stage 0: Normal (No Rheumatoid Arthritis)**

Stage 0 represents the absence of rheumatoid arthritis on radiographic examination. In this stage, X-ray images show healthy joint architecture with no evidence of inflammatory changes or structural damage characteristic of RA.

**Clinical Characteristics:**
Patients at Stage 0 show no clinical signs of rheumatoid arthritis. Joint function is completely normal, with no pain, swelling, stiffness, or limitation of movement. There are no systemic symptoms such as fatigue or morning stiffness associated with RA.

**Radiological Findings:**
Radiographs demonstrate normal joint space width, indicating intact cartilage. Bone density is uniform with no periarticular osteoporosis. Joint margins are smooth and well-defined with no erosions. The soft tissue shadow around joints appears normal without swelling or effusion.

**Significance:**
This stage serves as a baseline for comparison in monitoring at-risk patients or those with a family history of RA. Regular screening may be recommended for individuals with elevated rheumatoid factor or anti-CCP antibodies despite normal imaging.

**Management:**
No treatment is required. However, patients with positive serological markers may benefit from lifestyle modifications, including smoking cessation, maintaining healthy weight, and regular exercise to reduce future RA risk.`,

      1: `**Stage 1: Doubtful/Minimal Rheumatoid Arthritis**

Stage 1 represents the earliest detectable changes in rheumatoid arthritis, where radiographic findings are subtle and diagnosis may be uncertain. This stage is characterized by minimal changes that may suggest early inflammatory arthritis.

**Clinical Characteristics:**
Patients often present with vague symptoms including mild joint pain, subtle swelling, and brief morning stiffness lasting less than 30 minutes. Joint function is largely preserved, but patients may notice slight discomfort with prolonged activity. Systemic symptoms are typically absent or minimal.

**Radiological Findings:**
X-rays may show periarticular soft tissue swelling, indicating joint inflammation. There may be very slight joint space narrowing, though this can be difficult to distinguish from normal variation. Periarticular osteoporosis may begin to appear around affected joints. No definite erosions are present at this stage.

**Disease Progression:**
Early detection at Stage 1 is crucial as this represents a therapeutic window where aggressive treatment can potentially prevent progression to more advanced stages. Without treatment, many patients progress to Stage 2 within 1-2 years.

**Treatment Approach:**
Early intervention with disease-modifying antirheumatic drugs (DMARDs), particularly methotrexate, is recommended. NSAIDs may be used for symptomatic relief. Low-dose corticosteroids can help control inflammation during DMARD initiation. Regular monitoring with imaging and laboratory tests is essential to assess treatment response.`,

      2: `**Stage 2: Mild Rheumatoid Arthritis**

Stage 2 represents established rheumatoid arthritis with definite radiographic changes indicating ongoing joint damage. This stage shows clear evidence of inflammatory arthritis with structural changes that are still potentially reversible with aggressive treatment.

**Clinical Characteristics:**
Patients experience persistent joint pain and swelling, typically affecting multiple small joints symmetrically. Morning stiffness lasts more than 30 minutes, often extending to several hours. Joint function begins to decline with reduced grip strength and difficulty with fine motor tasks. Fatigue is common, and patients may experience low-grade fever during disease flares.

**Radiological Findings:**
X-rays demonstrate periarticular osteoporosis around affected joints due to inflammatory hyperemia and disuse. Small marginal erosions become visible at joint margins, particularly in the metacarpophalangeal and proximal interphalangeal joints. Joint space narrowing is evident, indicating cartilage loss. Soft tissue swelling is pronounced around affected joints.

**Disease Impact:**
At this stage, patients begin experiencing functional limitations in daily activities. Work productivity may be affected, and patients often require assistance with tasks requiring fine manual dexterity. Quality of life starts to decline due to chronic pain and fatigue.

**Treatment Strategy:**
Combination DMARD therapy is often required, typically methotrexate with hydroxychloroquine or sulfasalazine. Biologic agents (TNF inhibitors, IL-6 inhibitors) should be considered if conventional DMARDs fail. Corticosteroids may be used for bridging therapy. Physical and occupational therapy become important to maintain function. Regular monitoring every 3-6 months is essential.`,

      3: `**Stage 3: Moderate Rheumatoid Arthritis**

Stage 3 represents advanced rheumatoid arthritis with extensive joint damage and functional impairment. This stage is characterized by substantial structural damage to multiple joints with visible deformity and significant disability.

**Clinical Characteristics:**
Patients experience severe, persistent joint pain and marked swelling affecting multiple joints. Morning stiffness typically lasts several hours. Joint deformities become apparent, including ulnar deviation of fingers, boutonnière deformity, and swan-neck deformity. Range of motion is significantly reduced. Muscle atrophy develops due to disuse. Systemic manifestations may include subcutaneous nodules, anemia, and fatigue.

**Radiological Findings:**
X-rays show extensive erosive changes at joint margins with multiple erosions present. Marked joint space narrowing indicates severe cartilage loss. Periarticular osteoporosis is pronounced. Subluxation of joints may be visible, particularly in the metacarpophalangeal joints. Soft tissue changes include chronic swelling and muscle wasting.

**Functional Impact:**
Significant disability affects daily living activities. Patients struggle with basic self-care tasks such as dressing, eating, and personal hygiene. Work capacity is severely compromised, and many patients are unable to continue employment. Assistive devices and home modifications become necessary.

**Treatment Approach:**
Aggressive combination therapy with biologic or targeted synthetic DMARDs is essential. Options include TNF inhibitors, rituximab, abatacept, tocilizumab, or JAK inhibitors. Pain management becomes critical, requiring analgesics and sometimes opioids. Surgical interventions such as synovectomy or joint fusion may be considered for severely affected joints. Comprehensive rehabilitation including physical therapy, occupational therapy, and psychological support is vital. Monitoring should occur every 2-3 months.`,

      4: `**Stage 4: Severe Rheumatoid Arthritis**

Stage 4 represents the most advanced form of rheumatoid arthritis with terminal joint destruction and severe disability. This stage is characterized by end-stage arthritis with extensive joint damage, deformity, and ankylosis.

**Clinical Characteristics:**
Patients experience chronic, severe pain that may persist even at rest. Multiple joints show fixed deformities and ankylosis (fusion). Range of motion is extremely limited or completely lost in affected joints. Severe muscle atrophy and weakness are present throughout affected limbs. Systemic complications may include rheumatoid vasculitis, interstitial lung disease, and cardiovascular disease. Depression and anxiety are common due to severe disability.

**Radiological Findings:**
X-rays reveal extensive bone erosions with complete loss of joint architecture. Joint spaces are markedly narrowed or completely obliterated. Fibrous or bony ankylosis may be present, showing complete fusion of joint surfaces. Severe subluxation and dislocation of joints are visible. Osteoporosis is widespread, increasing fracture risk. Soft tissue calcification may be present.

**Functional Impact:**
Patients are severely disabled and dependent on others for most activities of daily living. Self-care is impossible without assistance. Mobility is extremely limited, often requiring wheelchair or complete bed rest. Employment is not possible. Quality of life is profoundly impacted, with patients experiencing significant physical and psychological distress.

**Treatment Strategy:**
At this stage, focus shifts to symptom management and maximizing remaining function. Biologic therapy may still be beneficial to prevent further damage and reduce inflammation. Pain management requires multimodal approach including NSAIDs, opioids, and adjuvant analgesics. Surgical options include total joint arthroplasty (replacement) for major joints like knees and hips, which can significantly improve function and quality of life. Arthrodesis (joint fusion) may be performed for smaller joints to provide stability and reduce pain. Comprehensive supportive care including physical therapy, occupational therapy, psychological counseling, and social support services is essential. Palliative care principles should be integrated to address quality of life, pain management, and psychosocial needs.`,
    };

    return stageInfo[stage] || 'Information not available.';
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Detailed RA Stage Analysis
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Select a stage below to view comprehensive medical information about rheumatoid arthritis 
          progression, clinical findings, and treatment approaches.
        </p>
      </div>

      {/* Stage Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Select RA Stage</h3>
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
