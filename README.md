# AI Image Studio - Cotton Weed Image Generator

A complete MERN stack application for generating cotton weed images using a Transformer + Diffusion + VAE deep learning model.

## Project Structure

```
ai-image-studio/
├── frontend/          # React.js frontend
├── backend/           # Node.js + Express.js backend
├── model-server/      # FastAPI Python model server
└── model/             # Model checkpoint files (.pth)
```

## Features

- **Generate Page**: Upload input image, select number of images (4, 8, 16), generate and display results
- **Metrics Page**: View FID scores and model performance metrics with charts
- **About Page**: Learn about model architecture, training, and purpose
- **Download**: Individual image download or download all as ZIP file
- **Modern UI**: Clean design with Tailwind CSS, white and green theme

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8 or higher
- MongoDB Atlas account (or local MongoDB)

### 1. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
MODEL_SERVER_URL=http://localhost:8000
```

```bash
npm start
```

Backend runs on `http://localhost:5000`

### 3. Model Server Setup

```bash
cd model-server
pip install -r requirements.txt
```

Place your `.pth` checkpoint file in the `model/` directory.

```bash
python server.py
```

Model server runs on `http://localhost:8000`

## API Endpoints

### Backend (Express)

- `POST /api/generate` - Generate images
  - Body: `{ label: string, num_samples: number, image: File }`

### Model Server (FastAPI)

- `POST /generate` - Generate images using the model
  - Body: `{ label: string, num_samples: number, image_base64: string }`

## Deployment

1. Build frontend: `cd frontend && npm run build`
2. Deploy backend to a Node.js hosting service
3. Deploy model server to a Python hosting service (with GPU support recommended)
4. Update environment variables with production URLs

## Notes

- Ensure the model checkpoint file is in the `model/` directory
- The model server loads the checkpoint once at startup
- Generated images are returned as base64 encoded strings
