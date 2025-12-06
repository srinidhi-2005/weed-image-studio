# Model Server Setup

## Important: Model Integration Required

The current `server.py` contains placeholder code for model loading and image generation. You need to replace the placeholder sections with your actual model code.

## Steps to Integrate Your Model

1. **Place your `.pth` checkpoint file** in the `../model/` directory (parent directory of model-server)

2. **Update `load_model()` function** in `server.py`:
   - Import your actual model architecture
   - Replace the placeholder model initialization with your model
   - Adjust checkpoint loading based on how your checkpoint is saved

3. **Update `generate_images()` function** in `server.py`:
   - Replace the placeholder generation code with your actual model's generation method
   - Ensure the output is converted to PIL Images and then to base64

4. **Adjust preprocessing** in `preprocess_image()`:
   - Update image size, normalization, and transforms to match your model's requirements

## Example Integration

```python
# In load_model():
from your_model import TransformerDiffusionVAE

model = TransformerDiffusionVAE(
    # your parameters
)
checkpoint = torch.load(checkpoint_path, map_location=device)
model.load_state_dict(checkpoint['model_state_dict'])
model.to(device)
model.eval()

# In generate_images():
with torch.no_grad():
    for i in range(num_samples):
        generated = model.generate(input_image, label=label)
        generated_images.append(image_to_base64(generated))
```

## Running the Server

```bash
pip install -r requirements.txt
python server.py
```

The server will run on `http://localhost:8000`

