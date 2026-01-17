"""
Test script for RA Detection Backend API
Tests the Flask server and PyTorch CORAL model inference
"""

import requests
import os
import sys

# Configuration
BASE_URL = "http://localhost:5000"
TEST_IMAGE_PATH = "test_image.jpg"  # Change this to your test image path


def test_health_check():
    """Test the health check endpoint"""
    print("\n" + "="*50)
    print("Testing Health Check Endpoint")
    print("="*50)
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Health check passed!")
            return True
        else:
            print("❌ Health check failed!")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n⚠️  Make sure the backend server is running:")
        print("   cd RA_backend")
        print("   python app.py")
        return False


def test_prediction(image_path):
    """Test the prediction endpoint"""
    print("\n" + "="*50)
    print("Testing Prediction Endpoint")
    print("="*50)
    
    if not os.path.exists(image_path):
        print(f"❌ Test image not found: {image_path}")
        print("\nPlease provide a test X-ray image.")
        return False
    
    try:
        print(f"Uploading image: {image_path}")
        
        with open(image_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(f"{BASE_URL}/predict", files=files)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("\n✅ Prediction successful!")
            print("\nResults:")
            print(f"  Grade: {result.get('grade')}")
            print(f"  Severity: {result.get('severity')}")
            print(f"  Confidence: {result.get('confidence')}%")
            print(f"  Model Type: {result.get('model_type', 'N/A')}")
            print(f"  Explanation: {result.get('explanation')}")
            
            if 'probabilities' in result:
                print("\n  Class Probabilities:")
                for stage, prob in result['probabilities'].items():
                    print(f"    {stage}: {prob:.4f}")
            
            if 'ordinal_outputs' in result:
                print("\n  CORAL Ordinal Outputs (cumulative probabilities):")
                for i, val in enumerate(result['ordinal_outputs']):
                    print(f"    P(stage > {i}): {val:.4f}")
            
            return True
        else:
            print(f"❌ Prediction failed!")
            print(f"Response: {response.json()}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_invalid_file():
    """Test error handling with invalid file"""
    print("\n" + "="*50)
    print("Testing Error Handling")
    print("="*50)
    
    try:
        # Test with no file
        response = requests.post(f"{BASE_URL}/predict")
        print(f"No file test - Status Code: {response.status_code}")
        
        if response.status_code == 400:
            print("✅ Correctly rejected request with no file")
        else:
            print("⚠️  Expected 400 status code")
            
    except Exception as e:
        print(f"❌ Error: {e}")


def main():
    print("\n" + "="*60)
    print("  RA Detection Backend API Test Suite")
    print("="*60)
    
    # Test 1: Health Check
    health_ok = test_health_check()
    
    if not health_ok:
        print("\n❌ Backend server is not accessible. Exiting.")
        sys.exit(1)
    
    # Test 2: Error Handling
    test_invalid_file()
    
    # Test 3: Prediction (if test image is provided)
    if len(sys.argv) > 1:
        test_image = sys.argv[1]
        test_prediction(test_image)
    else:
        print("\n" + "="*50)
        print("Skipping prediction test")
        print("="*50)
        print("\nTo test prediction, run:")
        print(f"  python test_api.py <path_to_xray_image>")
    
    print("\n" + "="*60)
    print("  Test Suite Complete")
    print("="*60)


if __name__ == "__main__":
    main()
