# Backend Migration Summary

## Changes Made: TensorFlow → PyTorch + CORAL Ordinal Regression

### ✅ What Was Updated

#### 1. **app.py** - Complete Rewrite
**FROM:** TensorFlow/Keras EfficientNetB3 model
**TO:** PyTorch EfficientNet-B0 + CORAL Ordinal Regression

**Key Changes:**
- Imports: `tensorflow` → `torch`, `torchvision`
- Model loading: `keras.models.load_model()` → `torch.load()` with custom architecture
- Preprocessing: NumPy arrays → PyTorch tensors with transforms
- Prediction: Softmax classification → CORAL ordinal regression
- Output: Added `ordinal_outputs` and `model_type` fields

#### 2. **Model Architecture**
**Previous:** EfficientNetB3 (standard classification)
```python
# Old: 5 class probabilities from softmax
predictions = model.predict(image)
predicted_class = np.argmax(predictions)
```

**Current:** EfficientNet-B0 + CORAL (ordinal regression)
```python
# New: 4 cumulative probabilities from CORAL
outputs = model(image)  # Returns [P(y>0), P(y>1), P(y>2), P(y>3)]
predicted_class = coral_predict(outputs)  # Counts thresholds passed
```

#### 3. **Disease Focus**
**Previous:** Osteoarthritis (knee X-rays) - Kellgren-Lawrence grading
**Current:** Rheumatoid Arthritis (hand/wrist X-rays) - RA staging

**Updated Descriptions:**
- Stage 0: No erosions or joint space narrowing
- Stage 1: Minimal periarticular swelling
- Stage 2: Mild periarticular osteoporosis + early erosions
- Stage 3: Moderate erosions + joint space narrowing
- Stage 4: Severe joint destruction + ankylosis

#### 4. **requirements.txt**
```diff
- tensorflow==2.15.0
+ torch==2.1.2
+ torchvision==0.16.2
+ opencv-python==4.8.1.78
+ scikit-learn==1.3.2
+ seaborn==0.13.0
+ matplotlib==3.8.2
```

#### 5. **Documentation Updates**
- README.md: Updated model info, architecture details
- QUICKSTART.md: Changed model file paths and examples
- test_api.py: Added CORAL output display

---

### 📊 API Response Changes

#### Before (TensorFlow):
```json
{
  "grade": 2,
  "severity": "Mild",
  "confidence": 85.67,
  "explanation": "...",
  "probabilities": {
    "stage_0": 0.02,
    "stage_1": 0.08,
    "stage_2": 0.86,
    "stage_3": 0.03,
    "stage_4": 0.01
  }
}
```

#### After (PyTorch + CORAL):
```json
{
  "grade": 2,
  "severity": "Mild",
  "confidence": 85.67,
  "explanation": "...",
  "probabilities": {
    "stage_0": 0.02,
    "stage_1": 0.08,
    "stage_2": 0.86,
    "stage_3": 0.03,
    "stage_4": 0.01
  },
  "model_type": "CORAL Ordinal Regression",
  "ordinal_outputs": [0.98, 0.90, 0.10, 0.04]
}
```

**New Fields:**
- `model_type`: Identifies the model architecture
- `ordinal_outputs`: Raw CORAL cumulative probabilities (useful for XAI)

---

### 🔧 Technical Details

#### CORAL Ordinal Regression Explained

Traditional classification treats stages as independent categories. CORAL respects their natural order:

**Standard Classification:**
```
Predicting Stage 0 when true is Stage 4 = same penalty as Stage 3 vs Stage 4
```

**CORAL Ordinal Regression:**
```
Predicting Stage 0 when true is Stage 4 = larger penalty than Stage 3 vs Stage 4
Adjacent errors are penalized less than distant errors
```

**How CORAL Works:**
1. Model outputs 4 sigmoid values: `[P(y>0), P(y>1), P(y>2), P(y>3)]`
2. Each represents the probability that the stage exceeds threshold k
3. Predicted class = count of thresholds where P(y>k) > 0.5
4. Example: `[0.9, 0.8, 0.3, 0.1]` → 2 thresholds passed → Stage 2

**Converting to Class Probabilities:**
```python
P(stage = 0) = 1 - P(y > 0)
P(stage = k) = P(y > k-1) - P(y > k)  for k ∈ {1,2,3}
P(stage = 4) = P(y > 3)
```

---

### 🎯 Frontend Compatibility

**Good News:** Frontend requires NO changes! ✅

The API interface remains identical:
- Same endpoint: `POST /predict`
- Same request format: `multipart/form-data`
- Same core response fields: `grade`, `severity`, `confidence`, `explanation`, `probabilities`
- Additional fields are backward-compatible

Frontend will automatically receive and can optionally use:
- `model_type`: Display model architecture
- `ordinal_outputs`: For advanced visualizations (XAI)

---

### 📂 File Structure

```
RA_backend/
├── app.py                              # ✅ Updated - PyTorch-based API
├── requirements.txt                     # ✅ Updated - PyTorch dependencies
├── test_api.py                         # ✅ Updated - Shows CORAL outputs
├── README.md                           # ✅ Updated - Documentation
│
├── RA_Ordinal_Classification/
│   ├── efficientnet_ordinal.pth        # ✅ PyTorch model weights
│   ├── src/
│   │   ├── model.py                   # ✅ CORAL architecture
│   │   ├── dataset.py
│   │   ├── train.py
│   │   └── evaluate.py
│   └── demo.py
│
└── Best_EfficientNetB3.h5             # ❌ No longer used (can delete)
```

---

### 🚀 Next Steps for XAI Integration

Now that the PyTorch model is integrated, you can proceed with:

1. **Grad-CAM Implementation** (attention visualization)
   - Easy to implement with PyTorch hooks
   - `ordinal_outputs` already available for interpretation

2. **Feature Extraction**
   - Access intermediate layer activations
   - Extract embeddings from EfficientNet backbone

3. **LLM Integration**
   - Use `ordinal_outputs` to explain cumulative probabilities
   - Provide visual attention maps to LLaVA-Med/RadFM

Ready for XAI implementation! 🎉
