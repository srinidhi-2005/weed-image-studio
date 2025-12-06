from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torch.nn as nn
from PIL import Image
import io
import base64
import numpy as np
from typing import List
import os
import sys

# Add parent directory to path to access model folder
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = FastAPI(title="AI Image Studio Model Server")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variable
model = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class GenerationRequest(BaseModel):
    label: str
    num_samples: int
    image_base64: str

class GenerationResponse(BaseModel):
    images: List[str]
    success: bool

def load_model():
    """Load the model checkpoint from the model folder"""
    global model
    
    try:
        # Check multiple possible locations for the checkpoint
        possible_paths = [
            os.path.join(os.path.dirname(os.path.dirname(__file__)), "model"),  # ../model/
            os.path.dirname(__file__),  # model-server/
            os.path.join(os.path.dirname(__file__), "..", "model"),  # ../model/ (alternative)
        ]
        
        checkpoint_path = None
        for model_path in possible_paths:
            if os.path.exists(model_path):
                pth_files = [f for f in os.listdir(model_path) if f.endswith('.pth')]
                if pth_files:
                    checkpoint_path = os.path.join(model_path, pth_files[0])
                    break
        
        if not checkpoint_path:
            raise FileNotFoundError(
                "No .pth checkpoint file found. Please place your .pth file in:\n"
                "- model/ directory (preferred)\n"
                "- model-server/ directory"
            )
        
        print(f"Loading model from: {checkpoint_path}")
        
        # Load checkpoint
        checkpoint = torch.load(checkpoint_path, map_location=device)
        
        # Initialize model architecture (adjust based on your actual model)
        # This is a placeholder - you'll need to replace this with your actual model architecture
        # For now, we'll create a simple placeholder that you can replace
        
        # TODO: Replace this with your actual model architecture
        # Example structure (you need to replace with your actual model):
        # from your_model import YourModel
        # model = YourModel()
        # model.load_state_dict(checkpoint['model_state_dict'] or checkpoint)
        
        # Placeholder model for demonstration
        # In production, uncomment and use your actual model:
        """
        from your_model_file import TransformerDiffusionVAE
        model = TransformerDiffusionVAE(
            # your model parameters here
        )
        if 'model_state_dict' in checkpoint:
            model.load_state_dict(checkpoint['model_state_dict'])
        else:
            model.load_state_dict(checkpoint)
        """
        
        # For now, we'll use a dummy model that generates placeholder images
        # YOU MUST REPLACE THIS WITH YOUR ACTUAL MODEL
        print("WARNING: Using placeholder model. Please replace with your actual model architecture.")
        model = None  # Set to None to indicate placeholder
        
        print(f"Model loaded successfully on device: {device}")
        return True
        
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        print("Please ensure:")
        print("1. Your .pth checkpoint file is in the model/ directory")
        print("2. You have implemented the model loading code in load_model() function")
        print("3. Your model architecture matches the checkpoint")
        return False

def preprocess_image(image_base64: str) -> torch.Tensor:
    """Preprocess input image for model"""
    try:
        # Decode base64 image
        image_data = base64.b64decode(image_base64)
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        # Resize and normalize (adjust based on your model requirements)
        # Example: resize to 256x256 and normalize to [-1, 1]
        from torchvision import transforms
        transform = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
        ])
        
        image_tensor = transform(image).unsqueeze(0).to(device)
        return image_tensor
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image preprocessing error: {str(e)}")

def generate_images(model, input_image: torch.Tensor, num_samples: int, label: str) -> List[str]:
    """Generate images using the model"""
    try:
        generated_images = []
        
        # TODO: Replace this with your actual generation code
        # Example structure:
        # with torch.no_grad():
        #     for i in range(num_samples):
        #         generated = model.generate(input_image, label=label)
        #         # Convert to PIL Image and encode as base64
        #         generated_images.append(image_to_base64(generated))
        
        # Placeholder: Generate dummy images for demonstration
        # YOU MUST REPLACE THIS WITH YOUR ACTUAL GENERATION CODE
        print(f"WARNING: Using placeholder image generation. Generating {num_samples} dummy images.")
        
        for i in range(num_samples):
            # Create a dummy image (replace with actual generation)
            dummy_image = Image.new('RGB', (256, 256), color=(100, 150, 100))
            
            # Add some variation
            import random
            r = random.randint(80, 120)
            g = random.randint(140, 180)
            b = random.randint(80, 120)
            dummy_image = Image.new('RGB', (256, 256), color=(r, g, b))
            
            # Convert to base64
            buffered = io.BytesIO()
            dummy_image.save(buffered, format="PNG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
            generated_images.append(img_base64)
        
        return generated_images
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation error: {str(e)}")

def image_to_base64(image_tensor: torch.Tensor) -> str:
    """Convert PyTorch tensor to base64 encoded image"""
    # Denormalize
    image_tensor = (image_tensor + 1) / 2.0
    image_tensor = torch.clamp(image_tensor, 0, 1)
    
    # Convert to numpy and PIL
    image_np = image_tensor.squeeze(0).cpu().numpy()
    image_np = np.transpose(image_np, (1, 2, 0))
    image_np = (image_np * 255).astype(np.uint8)
    image = Image.fromarray(image_np)
    
    # Encode to base64
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    print("Starting model server...")
    print(f"Using device: {device}")
    success = load_model()
    if not success:
        print("WARNING: Model loading failed. Server will start but generation will use placeholders.")
    print("Model server ready!")

@app.get("/")
async def root():
    return {
        "message": "AI Image Studio Model Server",
        "status": "running",
        "model_loaded": model is not None,
        "device": str(device)
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/generate", response_model=GenerationResponse)
async def generate(request: GenerationRequest):
    """Generate images from input image"""
    try:
        if model is None:
            raise HTTPException(
                status_code=503,
                detail="Model not loaded. Please ensure your model checkpoint is in the model/ directory and model loading code is implemented."
            )
        
        # Preprocess input image
        input_tensor = preprocess_image(request.image_base64)
        
        # Generate images
        generated_images = generate_images(model, input_tensor, request.num_samples, request.label)
        
        return GenerationResponse(
            images=generated_images,
            success=True
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

