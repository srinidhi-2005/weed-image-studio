# Quick Start Guide

## Prerequisites Check

- [ ] Node.js installed (v16+)
- [ ] Python 3.8+ installed
- [ ] MongoDB Atlas account (or local MongoDB)
- [ ] Your `.pth` checkpoint file ready

## Quick Setup (5 minutes)

### 1. Place Your Model Checkpoint

Place your `.pth` file in either:
- `model/` directory (recommended)
- `model-server/` directory (also works)

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

Create `.env` file:
```bash
cp env.template .env
# Edit .env and add your MongoDB connection string
```

### 4. Install Model Server Dependencies

```bash
cd ../model-server
pip install -r requirements.txt
```

### 5. Integrate Your Model Code

**CRITICAL STEP**: Open `model-server/server.py` and:

1. Replace the placeholder in `load_model()` with your actual model loading code
2. Replace the placeholder in `generate_images()` with your actual generation code

See `model-server/README.md` for detailed instructions.

### 6. Start All Servers

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

### 7. Open Browser

Navigate to: `http://localhost:3000`

## Testing

1. Go to "Generate" page
2. Upload a cotton weed image
3. Select number of images (4, 8, or 16)
4. Click "Generate Images"
5. Wait for generation (may take a while)
6. Download individual images or all as ZIP

## Troubleshooting

### "Model not loaded" error
- Check that you've integrated your model code in `server.py`
- Verify your `.pth` file is in the correct location
- Check the console for specific error messages

### MongoDB connection error
- Verify your `MONGODB_URI` in `backend/.env`
- Test your connection string

### CORS errors
- Ensure backend is running on port 5000
- Check that CORS is enabled in `backend/server.js`

### Generation fails
- Check model server logs
- Verify model server is running on port 8000
- Ensure your model code is correctly integrated

## Next Steps

- Customize Metrics page with your actual metrics
- Update About page with your model details
- Adjust styling in Tailwind config if needed
- Deploy to production (see README.md)

