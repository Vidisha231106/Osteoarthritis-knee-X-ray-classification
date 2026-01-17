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
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'RA_Ordinal_Classification', 'src'))

from model import EfficientNetOrdinal, coral_predict

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'RA_Ordinal_Classification', 'efficientnet_ordinal.pth')
NUM_CLASSES = 5
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Load the trained PyTorch model
try:
    model = EfficientNetOrdinal(num_classes=NUM_CLASSES).to(DEVICE)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.eval()
    print(f"✅ PyTorch model loaded successfully from {MODEL_PATH}")
    print(f"📱 Using device: {DEVICE}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# Image preprocessing transform (must match training preprocessing)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Class definitions - Rheumatoid Arthritis Stages
STAGE_DESCRIPTIONS = {
    0: {
        "severity": "Normal",
        "explanation": "No signs of rheumatoid arthritis detected. Joint spaces appear normal with no significant abnormalities such as erosions, joint space narrowing, or soft tissue swelling."
    },
    1: {
        "severity": "Doubtful/Minimal",
        "explanation": "Minimal changes detected. Possible early signs of periarticular soft tissue swelling or slight joint space narrowing. Regular monitoring recommended to track progression."
    },
    2: {
        "severity": "Mild",
        "explanation": "Mild rheumatoid arthritis detected. Evidence of periarticular osteoporosis, slight joint space narrowing, and possible early erosions at the joint margins."
    },
    3: {
        "severity": "Moderate",
        "explanation": "Moderate rheumatoid arthritis detected. Clear joint space narrowing, multiple erosions, periarticular osteoporosis, and possible cartilage destruction with some joint deformity."
    },
    4: {
        "severity": "Severe",
        "explanation": "Severe rheumatoid arthritis detected. Marked joint destruction with extensive erosions, severe joint space loss, significant deformity, fibrous or bony ankylosis, and advanced cartilage loss."
    }
}


def preprocess_image(image_file):
    """
    Preprocess the uploaded image for PyTorch model prediction
    """
    try:
        # Read image
        img = Image.open(image_file).convert('RGB')
        
        # Apply transforms (resize, normalize)
        img_tensor = transform(img)
        
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
        'model_loaded': model is not None
    }), 200


@app.route('/predict', methods=['POST'])
def predict():
    """
    Main prediction endpoint
    Expects: multipart/form-data with 'file' field containing the image
    Returns: JSON with prediction results
    """
    if model is None:
        return jsonify({
            'error': 'Model not loaded. Please check server logs.'
        }), 500

    # Check if file is present in request
    if 'file' not in request.files:
        return jsonify({
            'error': 'No file provided. Please upload an image.'
        }), 400

    file = request.files['file']

    # Check if file is empty
    if file.filename == '':
        return jsonify({
            'error': 'Empty file provided.'
        }), 400

    # Validate file type
    allowed_extensions = {'.png', '.jpg', '.jpeg'}
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in allowed_extensions:
        return jsonify({
            'error': f'Invalid file type. Allowed types: {", ".join(allowed_extensions)}'
        }), 400

    try:
        # Preprocess image
        img_tensor = preprocess_image(file)
        img_tensor = img_tensor.to(DEVICE)

        # Make prediction (no gradient needed for inference)
        with torch.no_grad():
            # Forward pass through model
            outputs = model(img_tensor)  # Returns CORAL ordinal outputs (4 sigmoid values)
            
            # Convert ordinal outputs to predicted class
            predicted_class_tensor = coral_predict(outputs)
            predicted_class = int(predicted_class_tensor[0].item())
            
            # Calculate probabilities for each class from CORAL outputs
            # CORAL outputs are cumulative probabilities P(y > k)
            sigmoid_outputs = outputs[0].cpu().numpy()
            
            # Convert to class probabilities
            # P(y = 0) = 1 - P(y > 0)
            # P(y = k) = P(y > k-1) - P(y > k) for k > 0
            class_probs = np.zeros(NUM_CLASSES)
            class_probs[0] = 1.0 - sigmoid_outputs[0]
            for i in range(1, NUM_CLASSES - 1):
                class_probs[i] = sigmoid_outputs[i-1] - sigmoid_outputs[i]
            class_probs[NUM_CLASSES - 1] = sigmoid_outputs[NUM_CLASSES - 2]
            
            # Confidence is the probability of predicted class
            confidence = float(class_probs[predicted_class])
        
        # Get all class probabilities
        probabilities = {
            f"stage_{i}": float(class_probs[i])
            for i in range(NUM_CLASSES)
        }

        # Get stage description
        stage_info = STAGE_DESCRIPTIONS.get(predicted_class, {
            "severity": "Unknown",
            "explanation": "Unable to determine severity."
        })

        # Prepare response
        response = {
            'grade': predicted_class,
            'severity': stage_info['severity'],
            'confidence': round(confidence * 100, 2),
            'explanation': stage_info['explanation'],
            'probabilities': probabilities,
            'model_type': 'CORAL Ordinal Regression',
            'ordinal_outputs': sigmoid_outputs.tolist()  # For debugging/XAI
        }

        return jsonify(response), 200

    except ValueError as ve:
        return jsonify({
            'error': str(ve)
        }), 400
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({
            'error': f'Prediction failed: {str(e)}'
        }), 500


@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        'message': 'Osteoarthritis Knee X-ray Classification API',
        'version': '1.0.0',
        'endpoints': {
            '/health': 'GET - Health check',
            '/predict': 'POST - Upload image for prediction'
        }
    }), 200


if __name__ == '__main__':
    # Run the Flask app
    port = int(os.environ.get('PORT', 5000))
    print("🚀 Starting Osteoarthritis Detection API Server...")
    print(f"📁 Model path: {MODEL_PATH}")
    print(f"🌐 Port: {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
