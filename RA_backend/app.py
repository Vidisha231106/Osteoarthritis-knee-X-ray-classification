from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torchvision.transforms as transforms
import numpy as np
from PIL import Image
import io
import os
import sys

# Add RA_Ordinal_Classification src to path
project_root = os.path.dirname(os.path.abspath(__file__))
src_path = os.path.join(project_root, 'RA_Ordinal_Classification', 'src')
if src_path not in sys.path:
    sys.path.insert(0, src_path)

try:
    from model import EfficientNetOrdinal, coral_predict
except ImportError as e:
    print(f"❌ Import error: {e}")
    print(f"📁 Current directory: {os.getcwd()}")
    print(f"📁 Project root: {project_root}")
    print(f"📁 Src path: {src_path}")
    print(f"📁 Src path exists: {os.path.exists(src_path)}")
    
    # List files in src directory
    if os.path.exists(src_path):
        print(f"📁 Files in src: {os.listdir(src_path)}")
    
    # List files in RA_Ordinal_Classification
    ra_path = os.path.join(project_root, 'RA_Ordinal_Classification')
    if os.path.exists(ra_path):
        print(f"📁 Files in RA_Ordinal_Classification: {os.listdir(ra_path)}")
    
    print(f"📁 Sys path: {sys.path}")
    raise

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
CORAL_MODEL_PATH = os.path.join(os.path.dirname(__file__), 'RA_Ordinal_Classification', 'efficientnet_ordinal.pth')
NUM_CLASSES = 5
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# ==================== CORAL Model (PyTorch EfficientNet-B0) ====================
try:
    coral_model = EfficientNetOrdinal(num_classes=NUM_CLASSES).to(DEVICE)
    coral_model.load_state_dict(torch.load(CORAL_MODEL_PATH, map_location=DEVICE))
    coral_model.eval()
    print(f"✅ CORAL PyTorch model loaded successfully from {CORAL_MODEL_PATH}")
    print(f"📱 Using device: {DEVICE}")
except Exception as e:
    print(f"❌ Error loading CORAL model: {e}")
    coral_model = None

# PyTorch Image preprocessing transform (for CORAL model)
pytorch_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Class definitions - Kellgren-Lawrence Osteoarthritis Grades
STAGE_DESCRIPTIONS = {
    0: {
        "severity": "Normal",
        "explanation": "No signs of osteoarthritis detected. Joint spaces appear normal with no significant abnormalities such as osteophytes, joint space narrowing, or subchondral sclerosis."
    },
    1: {
        "severity": "Doubtful/Minimal",
        "explanation": "Minimal changes detected. Possible early signs of minute osteophytes with doubtful significance. Regular monitoring recommended to track progression."
    },
    2: {
        "severity": "Mild",
        "explanation": "Mild osteoarthritis detected. Definite osteophytes present with possible joint space narrowing."
    },
    3: {
        "severity": "Moderate",
        "explanation": "Moderate osteoarthritis detected. Multiple osteophytes, definite joint space narrowing, some sclerosis, and possible deformity of bone ends."
    },
    4: {
        "severity": "Severe",
        "explanation": "Severe osteoarthritis detected. Large osteophytes, marked joint space narrowing, severe sclerosis, and definite bone end deformity."
    }
}


def preprocess_image_pytorch(image_file):
    """
    Preprocess the uploaded image for PyTorch CORAL model prediction
    """
    try:
        # Read image
        img = Image.open(image_file).convert('RGB')
        
        # Apply transforms (resize, normalize)
        img_tensor = pytorch_transform(img)
        
        # Add batch dimension
        img_batch = img_tensor.unsqueeze(0)
        
        return img_batch
    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'coral_model_loaded': coral_model is not None
    }), 200


def validate_file(request):
    """Common file validation logic"""
    if 'file' not in request.files:
        return None, {'error': 'No file provided. Please upload an image.'}, 400
    
    file = request.files['file']
    
    if file.filename == '':
        return None, {'error': 'Empty file provided.'}, 400
    
    allowed_extensions = {'.png', '.jpg', '.jpeg'}
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in allowed_extensions:
        return None, {'error': f'Invalid file type. Allowed types: {", ".join(allowed_extensions)}'}, 400
    
    return file, None, None


def predict_coral(file):
    """Make prediction using CORAL ordinal regression model"""
    if coral_model is None:
        raise Exception("CORAL model not loaded")
    
    # Preprocess image
    file.seek(0)  # Reset file pointer
    img_tensor = preprocess_image_pytorch(file)
    img_tensor = img_tensor.to(DEVICE)

    # Make prediction (no gradient needed for inference)
    with torch.no_grad():
        outputs = coral_model(img_tensor)
        predicted_class_tensor = coral_predict(outputs)
        predicted_class = int(predicted_class_tensor[0].item())
        
        sigmoid_outputs = outputs[0].cpu().numpy()
        
        # Convert CORAL ordinal outputs to class probabilities
        class_probs = np.zeros(NUM_CLASSES)
        class_probs[0] = 1.0 - sigmoid_outputs[0]
        for i in range(1, NUM_CLASSES - 1):
            class_probs[i] = sigmoid_outputs[i-1] - sigmoid_outputs[i]
        class_probs[NUM_CLASSES - 1] = sigmoid_outputs[NUM_CLASSES - 2]
        
        confidence = float(class_probs[predicted_class])
    
    stage_info = STAGE_DESCRIPTIONS.get(predicted_class, {
        "severity": "Unknown",
        "explanation": "Unable to determine severity."
    })
    
    return {
        'grade': predicted_class,
        'severity': stage_info['severity'],
        'confidence': round(confidence * 100, 2),
        'explanation': stage_info['explanation'],
        'probabilities': {f"grade_{i}": float(class_probs[i]) for i in range(NUM_CLASSES)},
        'model_type': 'CORAL Ordinal Regression (EfficientNet-B0)',
        'model_description': 'Uses ordinal regression with CORAL loss to predict ordered KL grades. Leverages the ordinal nature of severity levels for more consistent predictions.',
        'ordinal_outputs': sigmoid_outputs.tolist()
    }


@app.route('/predict', methods=['POST'])
@app.route('/predict/coral', methods=['POST'])
def predict_coral_endpoint():
    """
    CORAL model prediction endpoint
    Expects: multipart/form-data with 'file' field containing the image
    Returns: JSON with CORAL model prediction results
    """
    if coral_model is None:
        return jsonify({'error': 'CORAL model not loaded. Please check server logs.'}), 500

    file, error, status = validate_file(request)
    if error:
        return jsonify(error), status

    try:
        result = predict_coral(file)
        return jsonify(result), 200
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        print(f"Error during CORAL prediction: {str(e)}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500


@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        'message': 'Osteoarthritis Knee X-ray Classification API',
        'version': '2.0.0',
        'model': 'EfficientNet-B0 with CORAL Ordinal Regression',
        'endpoints': {
            '/health': 'GET - Health check',
            '/predict': 'POST - CORAL model prediction',
            '/predict/coral': 'POST - CORAL model prediction (alias)'
        }
    }), 200


if __name__ == '__main__':
    # Run the Flask app
    port = int(os.environ.get('PORT', 5000))
    print("🚀 Starting Osteoarthritis Detection API Server...")
    print(f"📁 CORAL model path: {CORAL_MODEL_PATH}")
    print(f"🌐 Port: {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
