# Step-by-Step Browser Setup Guide

Follow these steps to set up and run the AI Image Studio in your browser.

## Prerequisites Installation

### Step 1: Install Node.js
1. Go to https://nodejs.org/
2. Download and install Node.js (v16 or higher)
3. Verify installation by opening a terminal/command prompt and typing:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers.

### Step 2: Install Python
1. Go to https://www.python.org/downloads/
2. Download and install Python 3.8 or higher
3. **IMPORTANT**: During installation, check "Add Python to PATH"
4. Verify installation:
   ```bash
   python --version
   pip --version
   ```

### Step 3: Set Up MongoDB
**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a free cluster
4. Create a database user
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
6. Save this connection string - you'll need it later

**Option B: Local MongoDB**
1. Download from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service

## Project Setup

### Step 4: Navigate to Project Directory
Open a terminal/command prompt and navigate to your project:
```bash
cd C:\Users\marth\Downloads\ai-image-studio
```

### Step 5: Set Up Frontend
1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   This will take a few minutes. Wait for it to complete.

3. Go back to project root:
   ```bash
   cd ..
   ```

### Step 6: Set Up Backend
1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   - **Windows**: Create a file named `.env` in the `backend` folder
   - **Mac/Linux**: Run `touch .env` or create manually
   
4. Open the `.env` file and add:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string_here
   MODEL_SERVER_URL=http://localhost:8000
   ```
   Replace `your_mongodb_connection_string_here` with your actual MongoDB connection string from Step 3.

5. Go back to project root:
   ```bash
   cd ..
   ```

### Step 7: Set Up Model Server
1. Navigate to model-server folder:
   ```bash
   cd model-server
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   This will take several minutes. Wait for it to complete.

3. **IMPORTANT**: Place your `.pth` checkpoint file:
   - Move your `.pth` file to either:
     - `model/` folder (recommended)
     - OR `model-server/` folder

4. Go back to project root:
   ```bash
   cd ..
   ```

### Step 8: Integrate Your Model (Required)
1. Open `model-server/server.py` in a text editor
2. Find the `load_model()` function (around line 41)
3. Replace the placeholder code with your actual model loading code
4. Find the `generate_images()` function (around line 100)
5. Replace the placeholder code with your actual image generation code
6. Save the file

**Note**: If you skip this step, the server will run but won't generate real images (only placeholders).

## Running the Application

You need to open **THREE separate terminal windows** (or tabs) to run all three servers.

### Step 9: Start Model Server (Terminal 1)
1. Open a new terminal/command prompt
2. Navigate to project:
   ```bash
   cd C:\Users\marth\Downloads\ai-image-studio\model-server
   ```
3. Start the server:
   ```bash
   python server.py
   ```
4. You should see:
   ```
   Starting model server...
   Using device: cpu (or cuda)
   Loading model from: ...
   Model server ready!
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```
5. **Keep this terminal open** - don't close it!

### Step 10: Start Backend Server (Terminal 2)
1. Open a **second** terminal/command prompt
2. Navigate to project:
   ```bash
   cd C:\Users\marth\Downloads\ai-image-studio\backend
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. You should see:
   ```
   MongoDB connected successfully
   Backend server running on port 5000
   Model server URL: http://localhost:8000
   ```
5. **Keep this terminal open** - don't close it!

### Step 11: Start Frontend (Terminal 3)
1. Open a **third** terminal/command prompt
2. Navigate to project:
   ```bash
   cd C:\Users\marth\Downloads\ai-image-studio\frontend
   ```
3. Start the frontend:
   ```bash
   npm start
   ```
4. Wait for it to compile (may take 30-60 seconds)
5. Your browser should **automatically open** to `http://localhost:3000`
6. If it doesn't open automatically, manually go to: `http://localhost:3000`
7. **Keep this terminal open** - don't close it!

## Using the Application in Browser

### Step 12: Navigate the Website
Once the browser opens, you'll see:
- **Navigation bar** at the top with: Generate, Metrics, About
- **Generate page** is the default/home page

### Step 13: Generate Images
1. On the **Generate** page:
   - Click "Upload Image" and select a cotton weed image
   - The image will appear in the preview
   - Select number of images from dropdown (4, 8, or 16)
   - Click "Generate Images" button

2. Wait for generation (this may take 1-5 minutes depending on your model)

3. Generated images will appear in a grid below

4. To download:
   - Click "Download" on individual images
   - OR click "Download All as ZIP" to download all at once

### Step 14: View Metrics
1. Click **"Metrics"** in the navigation bar
2. View FID scores, training metrics, and charts

### Step 15: View About Page
1. Click **"About"** in the navigation bar
2. Read about the model architecture and training

## Troubleshooting

### Browser shows "Cannot connect" or blank page
- Check that all three servers are running (Terminals 1, 2, 3)
- Make sure frontend terminal shows "Compiled successfully"
- Try refreshing the browser (F5 or Ctrl+R)

### "Failed to generate images" error
- Check Terminal 1 (Model Server) for errors
- Verify your model code is integrated in `server.py`
- Check that your `.pth` file is in the correct location

### MongoDB connection error
- Verify your connection string in `backend/.env`
- Make sure MongoDB Atlas cluster is running (if using cloud)
- Check that your IP is whitelisted in MongoDB Atlas

### Port already in use errors
- Close any other applications using ports 3000, 5000, or 8000
- Or change the ports in the configuration files

### Model server shows "Model not loaded"
- Check that your `.pth` file exists in `model/` or `model-server/` folder
- Verify you've integrated your model code in `server.py`
- Check the terminal for specific error messages

## Quick Reference: All Commands

**Terminal 1 (Model Server):**
```bash
cd C:\Users\marth\Downloads\ai-image-studio\model-server
python server.py
```

**Terminal 2 (Backend):**
```bash
cd C:\Users\marth\Downloads\ai-image-studio\backend
npm start
```

**Terminal 3 (Frontend):**
```bash
cd C:\Users\marth\Downloads\ai-image-studio\frontend
npm start
```

**Browser:**
- Open: `http://localhost:3000`

## Stopping the Servers

To stop the servers:
1. Go to each terminal window
2. Press `Ctrl + C` (Windows/Linux) or `Cmd + C` (Mac)
3. Confirm if prompted

## Next Time You Run

For future runs, you only need:
1. Start Model Server (Terminal 1)
2. Start Backend (Terminal 2)
3. Start Frontend (Terminal 3)
4. Open browser to `http://localhost:3000`

No need to reinstall dependencies unless you update the code!

