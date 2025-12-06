# AI Image Studio - Cotton Weed Image Generator

A complete MERN stack application for generating cotton weed images using a Transformer + Diffusion + MRAR deep learning model.

## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Running the Application](#running-the-application)
- [Using the Application](#using-the-application)
- [API Endpoints](#api-endpoints)
- [Data Flow](#data-flow)
- [Model Integration](#model-integration)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

## Project Overview

This application allows users to upload cotton weed images and generate variations using a deep learning model. The system consists of three main components:

- **Frontend**: React.js application with modern UI
- **Backend**: Express.js server with MongoDB integration
- **Model Server**: FastAPI server that loads and runs your PyTorch model

## Project Structure

```
ai-image-studio/
│
├── frontend/                    # React.js Frontend
│   ├── public/
│   │   └── index.html          # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js       # Navigation component
│   │   ├── pages/
│   │   │   ├── Generate.js     # Main generation page
│   │   │   ├── Metrics.js      # Metrics and charts page
│   │   │   └── About.js        # About page
│   │   ├── App.js              # Main app component
│   │   ├── index.js            # Entry point
│   │   └── index.css           # Global styles with Tailwind
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # Tailwind configuration
│   └── postcss.config.js       # PostCSS configuration
│
├── backend/                     # Node.js + Express.js Backend
│   ├── server.js               # Express server
│   ├── package.json            # Backend dependencies
│   ├── env.template            # Environment variables template
│   └── .gitignore
│
├── model-server/                # FastAPI Python Model Server
│   ├── server.py               # FastAPI server with model loading
│   ├── requirements.txt        # Python dependencies
│   └── .gitignore
│
├── model/                       # Model Checkpoint Directory
│   └── (your_model.pth)        # Place your .pth checkpoint here
│
└── README.md                    # This file
```

## Features

- **Generate Page**: Upload input image, select number of images (4, 8, 16), generate and display results in a responsive grid
- **Metrics Page**: View FID scores and model performance metrics with interactive charts
- **About Page**: Learn about model architecture, training process, and purpose
- **Download**: Individual image download or download all generated images as ZIP file
- **Modern UI**: Clean design with Tailwind CSS, white and green color theme, rounded corners, shadows, and responsive layout

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (3.8 or higher) - [Download](https://www.python.org/downloads/)
- **MongoDB Atlas** account (free) - [Sign up](https://www.mongodb.com/cloud/atlas) OR local MongoDB
- **Your `.pth` model checkpoint file**

### Verify Installations

```bash
node --version
npm --version
python --version
pip --version
```

## Quick Start

### 1. Place Your Model Checkpoint

Place your `.pth` file in either:

- `model/` directory (recommended)
- `model-server/` directory (also works)

### 2. Install Dependencies

**Frontend:**

```bash
cd frontend
npm install
```

**Backend:**

```bash
cd ../backend
npm install
```

**Model Server:**

```bash
cd ../model-server
pip install -r requirements.txt
```

### 3. Configure Backend

Create a `.env` file in the `backend/` directory:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
MODEL_SERVER_URL=http://localhost:8000
```

Replace `your_mongodb_connection_string_here` with your MongoDB Atlas connection string.

### 4. Integrate Your Model Code

**CRITICAL STEP**: Open `model-server/server.py` and:

1. Replace the placeholder in `load_model()` with your actual model loading code
2. Replace the placeholder in `generate_images()` with your actual generation code
3. Adjust `preprocess_image()` to match your model's input requirements

See [Model Integration](#model-integration) section for details.

### 5. Start All Servers

You need **THREE separate terminal windows**:

**Terminal 1 - Model Server:**

```bash
cd model-server
python server.py
```

**Terminal 2 - Backend:**

```bash
cd backend
npm start
```

**Terminal 3 - Frontend:**

```bash
cd frontend
npm start
```

### 6. Open Browser

Navigate to: `http://localhost:3000`

The browser should open automatically when the frontend starts.

## Detailed Setup

### Step 1: Install Prerequisites

#### Node.js Installation

1. Go to https://nodejs.org/
2. Download and install Node.js (v16 or higher)
3. Verify: `node --version` and `npm --version`

#### Python Installation

1. Go to https://www.python.org/downloads/
2. Download and install Python 3.8 or higher
3. **IMPORTANT**: During installation, check "Add Python to PATH"
4. Verify: `python --version` and `pip --version`

#### MongoDB Setup

**Option A: MongoDB Atlas (Cloud - Recommended)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a free cluster
4. Create a database user
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
6. Save this connection string

**Option B: Local MongoDB**

1. Download from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service

### Step 2: Project Setup

#### Frontend Setup

```bash
cd frontend
npm install
```

#### Backend Setup

```bash
cd ../backend
npm install
```

Create `.env` file in `backend/` directory:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
MODEL_SERVER_URL=http://localhost:8000
```

#### Model Server Setup

```bash
cd ../model-server
pip install -r requirements.txt
```

Place your `.pth` checkpoint file in `model/` directory.

### Step 3: Model Integration

See [Model Integration](#model-integration) section below for detailed instructions.

## Running the Application

You need to run all three servers simultaneously in separate terminal windows.

### Terminal 1: Model Server

```bash
cd model-server
python server.py
```

Expected output:

```
Starting model server...
Using device: cpu (or cuda)
Loading model from: ...
Model server ready!
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Keep this terminal open!**

### Terminal 2: Backend Server

```bash
cd backend
npm start
```

Expected output:

```
MongoDB connected successfully
Backend server running on port 5000
Model server URL: http://localhost:8000
```

**Keep this terminal open!**

### Terminal 3: Frontend

```bash
cd frontend
npm start
```

Expected output:

```
Compiled successfully!
You can now view ai-image-studio in the browser.
  Local:            http://localhost:3000
```

The browser should automatically open to `http://localhost:3000`. If not, navigate there manually.

**Keep this terminal open!**

### Stopping the Servers

To stop any server, go to its terminal and press `Ctrl + C` (Windows/Linux) or `Cmd + C` (Mac).

## Using the Application

### Generate Images

1. On the **Generate** page:

   - Click "Upload Image" and select a cotton weed image
   - The image will appear in the preview
   - Select number of images from dropdown (4, 8, or 16)
   - Click "Generate Images" button

2. Wait for generation (this may take 1-5 minutes depending on your model)

3. Generated images will appear in a responsive grid below

4. To download:
   - Click "Download" on individual images
   - OR click "Download All as ZIP" to download all at once

### View Metrics

1. Click **"Metrics"** in the navigation bar
2. View FID scores, training metrics, and interactive charts

### View About Page

1. Click **"About"** in the navigation bar
2. Read about the model architecture, training process, and purpose

## API Endpoints

### Express Backend (localhost:5000)

- `GET /api/health` - Health check
- `POST /api/generate` - Generate images
  - Body: `multipart/form-data` with `image` (File), `num_samples` (number), `label` (string)
- `GET /api/history` - Get generation history

### FastAPI Model Server (localhost:8000)

- `GET /` - Server info
- `GET /health` - Health check
- `POST /generate` - Generate images using the model
  - Body: `{ label: string, num_samples: number, image_base64: string }`
  - Returns: `{ images: string[], success: boolean }`

## Data Flow

```
User (Browser)
    ↓
React Frontend (localhost:3000)
    ↓ POST /api/generate
Express Backend (localhost:5000)
    ↓ POST /generate
FastAPI Model Server (localhost:8000)
    ↓ Load .pth checkpoint
    ↓ Generate images
    ↓ Return base64 images
Express Backend
    ↓ Save to MongoDB
    ↓ Return images
React Frontend
    ↓ Display in grid
    ↓ Download functionality
```

## Model Integration

### Important: Integrate Your Model Code

The `model-server/server.py` file contains placeholder code. You **must** replace it with your actual model code.

### Step 1: Update `load_model()` Function

Replace the placeholder code with your actual model loading:

### Step 2: Update `generate_images()` Function

Replace the placeholder code with your actual generation:

### Step 3: Adjust `preprocess_image()` Function

Update preprocessing to match your model's requirements:

### Model Integration Checklist

- [ ] Model checkpoint file placed in `model/` directory
- [ ] `load_model()` function updated with your model code
- [ ] `generate_images()` function updated with your generation code
- [ ] `preprocess_image()` adjusted to match your model's input requirements
- [ ] All necessary imports added to `server.py`
- [ ] Model tested and working

## Troubleshooting

### Browser shows "Cannot connect" or blank page

- Check that all three servers are running (Terminals 1, 2, 3)
- Make sure frontend terminal shows "Compiled successfully"
- Try refreshing the browser (F5 or Ctrl+R)
- Check browser console for errors (F12)

### "Failed to generate images" error

- Check Terminal 1 (Model Server) for errors
- Verify your model code is integrated in `server.py`
- Check that your `.pth` file is in the correct location
- Verify model server is running on port 8000

### MongoDB connection error

- Verify your connection string in `backend/.env`
- Make sure MongoDB Atlas cluster is running (if using cloud)
- Check that your IP is whitelisted in MongoDB Atlas
- Test your connection string separately

### Port already in use errors

- Close any other applications using ports 3000, 5000, or 8000
- Or change the ports in the configuration files

### Model server shows "Model not loaded"

- Check that your `.pth` file exists in `model/` or `model-server/` folder
- Verify you've integrated your model code in `server.py`
- Check the terminal for specific error messages
- Ensure all model dependencies are installed

### CORS errors

- Ensure backend is running on port 5000
- Check that CORS is enabled in `backend/server.js`
- Verify frontend is making requests to correct backend URL

### Generation fails

- Check model server logs for detailed errors
- Verify model server is running on port 8000
- Ensure your model code is correctly integrated
- Check that input image format matches model requirements

### Frontend build errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (should be v16+)
- Clear npm cache: `npm cache clean --force`

## Deployment

## Notes

- Ensure the model checkpoint file is in the `model/` directory
- The model server loads the checkpoint once at startup
- Generated images are returned as base64 encoded strings
- All three servers must be running simultaneously
- For production, consider using a process manager like PM2 for Node.js servers

## Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the model integration instructions
3. Check server logs for detailed error messages

---

**Happy Generating! 🌱**
