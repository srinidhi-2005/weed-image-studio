from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torch.nn as nn
from PIL import Image
import io
import base64
import numpy as np
from typing import List, Optional
import os
import sys
import types

# Add model directory to path
model_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "model", "TransDiff-main")
if os.path.exists(model_dir):
    sys.path.insert(0, model_dir)
    sys.path.insert(0, os.path.join(model_dir, "models"))

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown"""
    # Startup
    print("Starting model server...")
    print(f"Using device: {device}")
    success = load_model()
    if not success:
        print("\n" + "="*60)
        print("ERROR: Model loading failed. Server will not function properly.")
        print("="*60)
        print("Please ensure the following files exist:")
        print("1. model/TransDiff-main/pretrained/checkpoint-base.pth (pretrained base)")
        print("2. model/TransDiff-main/checkpoints/checkpointB-last.pth (fine-tuned)")
        print("3. model/TransDiff-main/pretrained/vae/kl16.ckpt (VAE)")
        print("4. model/TransDiff-main/models/ (model source files)")
        print("="*60 + "\n")
    else:
        print("Model server ready!")
    
    yield  # Server runs here
    
    # Shutdown (if needed)
    print("Shutting down model server...")

app = FastAPI(title="AI Image Studio Model Server", lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variables
model = None
vae = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Configuration
# IMPORTANT: Update num_classes to match your trained model
CONFIG = {
    "img_size": 256,
    "sampling_steps": 600,  # Number of diffusion steps (can reduce for faster generation)
    "cfg": 4.0,  # Classifier-free guidance scale
    "sampler": "maruyama",
    "scale_0": 0.95,
    "scale_1": 0.95,
    "num_classes": 3,  # UPDATE THIS: Number of classes in your dataset (e.g., 3 for cotton weeds)
    "vae_embed_dim": 16,
}

class GenerationRequest(BaseModel):
    num_samples: int
    image_base64: str
    label: Optional[str] = "0"  # Class label (can be string or int, will be converted)

class GenerationResponse(BaseModel):
    images: List[str]
    success: bool
    message: Optional[str] = None

def verify_file_paths(base_dir, model_base_dir):
    """Verify that required files exist and print their locations"""
    print("\n=== Verifying file paths ===")
    
    # Check model directory
    if not os.path.exists(model_base_dir):
        print(f"❌ Model directory not found: {model_base_dir}")
        return False
    else:
        print(f"✅ Model directory found: {model_base_dir}")
    
    # Check pretrained base model
    pretrained_base = os.path.join(model_base_dir, "pretrained", "checkpoint-base.pth")
    if os.path.exists(pretrained_base):
        print(f"✅ Pretrained base model found: {pretrained_base}")
    else:
        print(f"⚠️  Pretrained base model not found: {pretrained_base}")
    
    # Check fine-tuned checkpoint
    fine_tuned = os.path.join(model_base_dir, "checkpoints", "checkpointB-last.pth")
    if os.path.exists(fine_tuned):
        print(f"✅ Fine-tuned checkpoint found: {fine_tuned}")
    else:
        print(f"❌ Fine-tuned checkpoint not found: {fine_tuned}")
        return False
    
    # Check VAE
    vae_path = os.path.join(model_base_dir, "pretrained", "vae", "kl16.ckpt")
    if os.path.exists(vae_path):
        print(f"✅ VAE checkpoint found: {vae_path}")
    else:
        print(f"❌ VAE checkpoint not found: {vae_path}")
        return False
    
    print("=== All required files found ===\n")
    return True

def load_model():
    """Load the TransDiff model and VAE from checkpoints"""
    global model, vae
    
    try:
        # Find model directory
        base_dir = os.path.dirname(os.path.dirname(__file__))
        model_base_dir = os.path.join(base_dir, "model", "TransDiff-main")
        
        # Verify file paths first
        if not verify_file_paths(base_dir, model_base_dir):
            print("ERROR: Required files are missing. Please check the paths above.")
            return False
        
        if not os.path.exists(model_base_dir):
            raise FileNotFoundError(f"Model directory not found: {model_base_dir}")
        
        # Import models - add paths first
        sys.path.insert(0, model_base_dir)
        models_dir = os.path.join(model_base_dir, "models")
        if os.path.exists(models_dir):
            sys.path.insert(0, models_dir)
        
        # Try importing
        try:
            from models.transdiff import transdiff_base
            from models.vae import AutoencoderKL
            print("✅ Successfully imported TransDiff models")
        except ImportError as e:
            print(f"❌ Import error: {e}")
            print(f"Current sys.path includes: {[p for p in sys.path if 'TransDiff' in p or 'model' in p]}")
            print("Trying direct import...")
            try:
                # Try direct import from models directory
                import importlib.util
                transdiff_path = os.path.join(models_dir, "transdiff.py")
                vae_path = os.path.join(models_dir, "vae.py")
                
                if os.path.exists(transdiff_path) and os.path.exists(vae_path):
                    spec_transdiff = importlib.util.spec_from_file_location("transdiff", transdiff_path)
                    spec_vae = importlib.util.spec_from_file_location("vae", vae_path)
                    transdiff_module = importlib.util.module_from_spec(spec_transdiff)
                    vae_module = importlib.util.module_from_spec(spec_vae)
                    spec_transdiff.loader.exec_module(transdiff_module)
                    spec_vae.loader.exec_module(vae_module)
                    transdiff_base = transdiff_module.transdiff_base
                    AutoencoderKL = vae_module.AutoencoderKL
                    print("✅ Loaded models using direct import")
                else:
                    raise ImportError(f"Model files not found. transdiff.py: {os.path.exists(transdiff_path)}, vae.py: {os.path.exists(vae_path)}")
            except Exception as e2:
                print(f"❌ Failed to import models: {e2}")
                import traceback
                traceback.print_exc()
                return False
        
        print(f"Loading models on device: {device}")
        
        # Load TransDiff model
        print(f"Initializing TransDiff model with {CONFIG['num_classes']} classes...")
        model = transdiff_base(
            img_size=CONFIG["img_size"],
            patch_size=1,
            vae_embed_dim=CONFIG["vae_embed_dim"],
            class_num=CONFIG["num_classes"],
        )
        
        # Set mask_token and z_proj if required (some models need these)
        try:
            if not hasattr(model, 'mask_token') or model.mask_token is None:
                embed_dim = model.encoder_embed_dim if hasattr(model, 'encoder_embed_dim') else 768
                model.mask_token = nn.Parameter(torch.zeros(1, 64, embed_dim))
                print(f"Created mask_token with embed_dim={embed_dim}")
            if not hasattr(model, 'z_proj') or model.z_proj is None:
                token_dim = CONFIG["vae_embed_dim"] * (model.patch_size ** 2) if hasattr(model, 'patch_size') else 16
                embed_dim = model.encoder_embed_dim if hasattr(model, 'encoder_embed_dim') else 768
                model.z_proj = nn.Linear(token_dim, embed_dim)
                print(f"Created z_proj: {token_dim} -> {embed_dim}")
        except Exception as e:
            print(f"Warning setting model attributes: {e}")
            import traceback
            traceback.print_exc()
        
        # Load pretrained base model first (if available)
        pretrained_base_path = os.path.join(model_base_dir, "pretrained", "checkpoint-base.pth")
        if os.path.exists(pretrained_base_path):
            print(f"Loading pretrained base model from: {pretrained_base_path}")
            try:
                base_checkpoint = torch.load(pretrained_base_path, map_location=device)
                
                # Extract state dict
                if isinstance(base_checkpoint, dict):
                    if 'model_state_dict' in base_checkpoint:
                        base_state_dict = base_checkpoint['model_state_dict']
                    elif 'state_dict' in base_checkpoint:
                        base_state_dict = base_checkpoint['state_dict']
                    else:
                        base_state_dict = base_checkpoint
                else:
                    base_state_dict = base_checkpoint
                
                # Load base model weights
                missing_base, unexpected_base = model.load_state_dict(base_state_dict, strict=False)
                print(f"Loaded pretrained base model. Missing: {len(missing_base)}, Unexpected: {len(unexpected_base)}")
            except Exception as e:
                print(f"Warning: Could not load pretrained base model: {e}")
        else:
            print(f"Pretrained base model not found at {pretrained_base_path}, skipping...")
        
        # Now load fine-tuned checkpoint (this will override base weights)
        fine_tuned_path = os.path.join(model_base_dir, "checkpoints", "checkpointB-last.pth")
        if not os.path.exists(fine_tuned_path):
            # Try alternative locations
            alternative_paths = [
                os.path.join(base_dir, "model", "checkpointB-last.pth"),
                os.path.join(base_dir, "model", "checkpoints", "checkpointB-last.pth"),
            ]
            for alt_path in alternative_paths:
                if os.path.exists(alt_path):
                    fine_tuned_path = alt_path
                    break
        
        if os.path.exists(fine_tuned_path):
            print(f"Loading fine-tuned checkpoint from: {fine_tuned_path}")
            try:
                checkpoint = torch.load(fine_tuned_path, map_location=device)
                
                # Handle different checkpoint formats
                if isinstance(checkpoint, dict):
                    if 'model_state_dict' in checkpoint:
                        state_dict = checkpoint['model_state_dict']
                    elif 'state_dict' in checkpoint:
                        state_dict = checkpoint['state_dict']
                    elif 'base_model' in checkpoint:
                        # PEFT checkpoint format - might need special handling
                        if isinstance(checkpoint['base_model'], dict):
                            state_dict = checkpoint['base_model']
                        else:
                            state_dict = checkpoint
                        print("Detected PEFT checkpoint format")
                    else:
                        state_dict = checkpoint
                else:
                    state_dict = checkpoint
                
                # Handle PEFT/LoRA weights
                if isinstance(state_dict, dict):
                    peft_keys = [k for k in state_dict.keys() if 'lora' in k.lower() or 'peft' in k.lower()]
                    if peft_keys:
                        print(f"Detected PEFT/LoRA weights ({len(peft_keys)} keys)")
                        try:
                            from peft import PeftModel
                            print("PEFT detected - loading with PEFT support")
                        except ImportError:
                            print("PEFT not available - loading LoRA weights directly")
                
                # Load fine-tuned weights (strict=False to handle missing keys)
                try:
                    missing, unexpected = model.load_state_dict(state_dict, strict=False)
                    print(f"Loaded fine-tuned checkpoint. Missing keys: {len(missing)}, Unexpected keys: {len(unexpected)}")
                    if len(missing) > 0 and len(missing) < 20:
                        print(f"Missing keys: {list(missing)}")
                    elif len(missing) > 0:
                        print(f"First 10 missing keys: {list(missing)[:10]}")
                except Exception as e:
                    print(f"Warning: Error loading fine-tuned checkpoint: {e}")
                    print("Attempting to load compatible keys only...")
                    model_dict = model.state_dict()
                    compatible_dict = {k: v for k, v in state_dict.items() 
                                     if k in model_dict and v.shape == model_dict[k].shape}
                    model.load_state_dict(compatible_dict, strict=False)
                    print(f"Loaded {len(compatible_dict)} compatible keys")
            except Exception as e:
                print(f"Warning: Could not load fine-tuned checkpoint: {e}")
                import traceback
                traceback.print_exc()
        else:
            print(f"Fine-tuned checkpoint not found at {fine_tuned_path}")
            print("Using pretrained base model only (if loaded) or randomly initialized model.")
        
        # Load VAE - check exact path first
        vae_paths = [
            os.path.join(model_base_dir, "pretrained", "vae", "kl16.ckpt"),  # Your actual path
            os.path.join(base_dir, "model", "pretrained", "vae", "kl16.ckpt"),
            os.path.join(model_base_dir, "vae", "kl16.ckpt"),
        ]
        
        vae_path = None
        for path in vae_paths:
            if os.path.exists(path):
                vae_path = path
                print(f"Found VAE at: {vae_path}")
                break
        
        if vae_path:
            print(f"Loading VAE from: {vae_path}")
            vae = AutoencoderKL(
                embed_dim=CONFIG["vae_embed_dim"],
                ch_mult=(1, 1, 2, 2, 4),
                ckpt_path=vae_path
            )
        else:
            print("Warning: VAE checkpoint not found. Initializing new VAE.")
            vae = AutoencoderKL(
                embed_dim=CONFIG["vae_embed_dim"],
                ch_mult=(1, 1, 2, 2, 4),
                ckpt_path=None
            )
        
        # Move models to device
        model = model.to(device).to(torch.float32)
        vae = vae.to(device).to(torch.float32)
        
        # Set to eval mode
        model.eval()
        vae.eval()
        
        # Patch time_embed forward if needed
        try:
            if hasattr(model, 'diffdecoder') and hasattr(model.diffdecoder, 'net'):
                if hasattr(model.diffdecoder.net, 'time_embed'):
                    def patched_time_embed_forward(self, timestep):
                        timestep = self.timesteps_proj(timestep)
                        temb = self.time_embedder(timestep)
                        timestep_proj = self.time_proj(self.act_fn(temb))
                        return temb, timestep_proj
                    model.diffdecoder.net.time_embed.forward = types.MethodType(
                        patched_time_embed_forward, 
                        model.diffdecoder.net.time_embed
                    )
                    print("Patched time_embed.forward")
        except Exception as e:
            print(f"Warning patching time_embed: {e}")
        
        # Patch model.samples to use correct device instead of hardcoded .cuda()
        try:
            original_samples = model.samples
            def device_aware_samples(self, labels, num_sampling_steps=100, cfg=1.0, sampler='maruyama', scale_0=1.0, scale_1=1.0):
                """Wrapper that ensures device compatibility"""
                bsz = labels.size(0)
                # Use device from labels instead of hardcoded .cuda()
                tokens = torch.zeros(bsz, self.seq_len, self.token_embed_dim, device=labels.device, dtype=labels.dtype)
                class_embedding = self.class_emb(labels)
                
                if not cfg == 1.0:
                    tokens = torch.cat([tokens, tokens], dim=0)
                    class_embedding = torch.cat([class_embedding, self.fake_latent.repeat(bsz, 1).to(labels.device)], dim=0)
                
                z, loss_diversity = self.forward_encoder(tokens, class_embedding)
                
                # Import here to avoid circular dependencies
                from diffusers.utils.torch_utils import randn_tensor
                from models.samplers import euler_maruyama_sampler
                
                noise = randn_tensor((bsz, self.seq_len * (self.img_size // 256) ** 2, self.token_embed_dim), 
                                   generator=None, device=z.device, dtype=z.dtype)
                if sampler == 'maruyama':
                    sampled_token_latent = euler_maruyama_sampler(model=self.diffdecoder.net, latents=noise, c=z,
                                                                  num_steps=num_sampling_steps, cfg_scale=cfg,
                                                                  scale_0=scale_0, scale_1=scale_1)
                else:
                    raise Exception("sampler must be maruyama.")
                tokens = self.unpatchify(sampled_token_latent, hw=16 * (self.img_size // 256))
                return tokens
            
            model.samples = types.MethodType(device_aware_samples, model)
            print("Patched model.samples() for device compatibility")
        except Exception as e:
            print(f"Warning patching model.samples: {e}")
            import traceback
            traceback.print_exc()
        
        print(f"Models loaded successfully on {device}")
        return True
        
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def preprocess_image(image_base64: str) -> torch.Tensor:
    """Preprocess input image for VAE encoding"""
    try:
        # Decode base64 image
        if image_base64.startswith('data:image'):
            image_base64 = image_base64.split(',')[1]
        
        image_data = base64.b64decode(image_base64)
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        # Resize and normalize to [-1, 1]
        from torchvision import transforms
        transform = transforms.Compose([
            transforms.Resize((CONFIG["img_size"], CONFIG["img_size"])),
            transforms.ToTensor(),
            transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
        ])
        
        image_tensor = transform(image).unsqueeze(0).to(device)
        return image_tensor
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image preprocessing error: {str(e)}")

def generate_images(num_samples: int, label: int = 0) -> List[torch.Tensor]:
    """Generate images using the TransDiff model"""
    try:
        if model is None or vae is None:
            raise RuntimeError("Model or VAE not loaded")
        
        # Create labels tensor
        labels = torch.tensor([label] * num_samples, dtype=torch.long).to(device)
        
        # Generate latents using model
        with torch.no_grad():
            latents = model.samples(
                labels=labels,
                num_sampling_steps=CONFIG["sampling_steps"],
                cfg=CONFIG["cfg"],
                sampler=CONFIG["sampler"],
                scale_0=CONFIG["scale_0"],
                scale_1=CONFIG["scale_1"]
            )
            
            # Decode latents with VAE
            # Check latents shape - should be [B, C, H, W] for VAE
            if latents.dim() == 3:
                # If latents are [B, seq_len, embed_dim], need to reshape
                # This depends on your model's output format
                print(f"Warning: Latents shape is {latents.shape}, expected 4D for VAE")
                # Try to reshape if possible (this may need adjustment based on your model)
                B, seq_len, embed_dim = latents.shape
                # Assuming square images: seq_len = H * W
                hw = int(seq_len ** 0.5)
                if hw * hw == seq_len:
                    latents = latents.view(B, embed_dim, hw, hw)
                else:
                    # Fallback: try to infer from model
                    img_size = CONFIG["img_size"]
                    latent_size = img_size // 8  # Typical VAE downsampling
                    latents = latents.view(B, embed_dim, latent_size, latent_size)
            
            # Normalize latents (divide by 0.18215 as in the training code)
            latents = latents / 0.18215
            
            # Ensure latents are on correct device
            latents = latents.to(device)
            
            # Decode in batches to avoid memory issues
            batch_size = min(8, num_samples)  # Smaller batch for memory safety
            images = []
            
            for i in range(0, num_samples, batch_size):
                batch_latents = latents[i:i + batch_size]
                try:
                    decoded = vae.decode(batch_latents)
                    decoded = torch.clamp(decoded, -1, 1)
                    images.append(decoded.cpu())
                except Exception as e:
                    print(f"Error decoding batch {i}: {e}")
                    # Try with single image
                    for j in range(batch_latents.shape[0]):
                        single_latent = batch_latents[j:j+1]
                        decoded = vae.decode(single_latent)
                        decoded = torch.clamp(decoded, -1, 1)
                        images.append(decoded.cpu())
            
            if len(images) == 0:
                raise RuntimeError("Failed to decode any images")
            
            images = torch.cat(images, dim=0)
        
        return images
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation error: {str(e)}")

def image_to_base64(image_tensor: torch.Tensor) -> str:
    """Convert PyTorch tensor to base64 encoded image"""
    try:
        # Denormalize from [-1, 1] to [0, 1]
        image_tensor = (image_tensor + 1) / 2.0
        image_tensor = torch.clamp(image_tensor, 0, 1)
        
        # Convert to numpy and PIL
        if image_tensor.dim() == 4:
            image_tensor = image_tensor.squeeze(0)
        
        image_np = image_tensor.cpu().numpy()
        if image_np.shape[0] == 3:  # CHW format
            image_np = np.transpose(image_np, (1, 2, 0))
        
        image_np = (image_np * 255).astype(np.uint8)
        image = Image.fromarray(image_np)
        
        # Encode to base64
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode('utf-8')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image encoding error: {str(e)}")

@app.get("/")
async def root():
    return {
        "message": "AI Image Studio Model Server",
        "status": "running",
        "model_loaded": model is not None,
        "vae_loaded": vae is not None,
        "device": str(device),
        "config": CONFIG
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "vae_loaded": vae is not None
    }

@app.post("/generate", response_model=GenerationResponse)
async def generate(request: GenerationRequest):
    """Generate images from input image"""
    try:
        if model is None or vae is None:
            raise HTTPException(
                status_code=503,
                detail="Model or VAE not loaded. Please check server logs."
            )
        
        # Validate num_samples
        if request.num_samples <= 0 or request.num_samples > 32:
            raise HTTPException(
                status_code=400,
                detail="num_samples must be between 1 and 32"
            )
        
        # Convert label to integer
        try:
            if isinstance(request.label, str):
                # Try to extract number from string (e.g., "cotton_weed" -> 0, "1" -> 1)
                label_int = int(request.label) if request.label.isdigit() else 0
            else:
                label_int = int(request.label)
        except (ValueError, TypeError):
            label_int = 0
        
        # Validate label
        if label_int < 0 or label_int >= CONFIG["num_classes"]:
            label_int = 0  # Default to class 0
            print(f"Warning: Invalid label, defaulting to class 0")
        
        # Preprocess input image (for validation/future use)
        # The model generates from scratch based on label, but we validate the input image
        try:
            input_tensor = preprocess_image(request.image_base64)
            print(f"Input image validated: shape {input_tensor.shape}")
        except Exception as e:
            print(f"Warning: Could not preprocess input image: {e}")
            # Continue anyway - model generates from scratch
        
        print(f"Generating {request.num_samples} images for class {label_int}...")
        
        # Generate images
        generated_images_tensor = generate_images(request.num_samples, label_int)
        
        # Convert to base64
        generated_images_base64 = []
        for i in range(generated_images_tensor.shape[0]):
            img_base64 = image_to_base64(generated_images_tensor[i])
            generated_images_base64.append(img_base64)
        
        print(f"Successfully generated {len(generated_images_base64)} images")
        
        return GenerationResponse(
            images=generated_images_base64,
            success=True,
            message=f"Generated {len(generated_images_base64)} images for class {label_int}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
