# Setup Instructions

## Prerequisites

- Node.js (v16 or higher)
- Python 3.8 or higher
- MongoDB Atlas account (or local MongoDB)
- Your `.pth` model checkpoint file

## Step-by-Step Setup

### 1. Place Your Model Checkpoint

Place your `.pth` checkpoint file in the `model/` directory:
```
model/
  └── your_model_checkpoint.pth
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
MODEL_SERVER_URL=http://localhost:8000
```

Start the backend:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### 4. Model Server Setup

**IMPORTANT**: Before running the model server, you need to integrate your actual model code.

1. Open `model-server/server.py`
2. Replace the placeholder code in `load_model()` with your actual model loading code
3. Replace the placeholder code in `generate_images()` with your actual generation code
4. Adjust `preprocess_image()` to match your model's input requirements

See `model-server/README.md` for detailed integration instructions.

After integrating your model:

```bash
cd model-server
pip install -r requirements.txt
python server.py
```

The model server will run on `http://localhost:8000`

## Testing the Setup

1. Start all three servers (frontend, backend, model server)
2. Open `http://localhost:3000` in your browser
3. Navigate to the "Generate" page
4. Upload an image and try generating images

## Troubleshooting

### Model Server Issues

- **"No .pth checkpoint file found"**: Ensure your checkpoint file is in the `model/` directory
- **"Model not loaded"**: Check that you've integrated your model code in `server.py`
- **Generation errors**: Verify your model's input/output format matches the preprocessing/postprocessing code

### Backend Issues

- **MongoDB connection error**: Check your `MONGODB_URI` in the `.env` file
- **Model server connection error**: Ensure the model server is running on port 8000

### Frontend Issues

- **CORS errors**: Ensure backend CORS is configured correctly
- **API errors**: Check that backend and model server are running

## Model Integration Example

Here's a template for integrating your model:

```python
# In model-server/server.py, update load_model():

from your_model_module import YourModelClass

def load_model():
    global model
    checkpoint_path = "../model/your_checkpoint.pth"
    checkpoint = torch.load(checkpoint_path, map_location=device)
    
    model = YourModelClass(
        # your model parameters
    )
    model.load_state_dict(checkpoint['model_state_dict'])
    model.to(device)
    model.eval()
    
    return True

# Update generate_images():

def generate_images(model, input_image, num_samples, label):
    generated_images = []
    with torch.no_grad():
        for i in range(num_samples):
            generated = model.generate(input_image, label=label)
            generated_images.append(image_to_base64(generated))
    return generated_images
```

## Next Steps

1. Integrate your model code
2. Test image generation
3. Customize the Metrics page with your actual metrics
4. Update the About page with your specific model details
5. Deploy to production (see main README.md)

