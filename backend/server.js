const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MODEL_SERVER_URL = process.env.MODEL_SERVER_URL || 'http://localhost:8000';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-image-studio')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Generation history schema
const generationSchema = new mongoose.Schema({
  inputImage: String,
  numSamples: Number,
  label: String,
  generatedImages: [String],
  timestamp: { type: Date, default: Date.now }
});

const Generation = mongoose.model('Generation', generationSchema);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check model server health
    const modelServerHealth = await axios.get(`${MODEL_SERVER_URL}/health`, {
      timeout: 5000
    }).catch(() => null);
    
    res.json({ 
      status: 'ok', 
      message: 'Server is running',
      modelServer: modelServerHealth ? {
        status: modelServerHealth.data.status,
        modelLoaded: modelServerHealth.data.model_loaded,
        vaeLoaded: modelServerHealth.data.vae_loaded
      } : { status: 'unreachable' }
    });
  } catch (error) {
    res.json({ 
      status: 'ok', 
      message: 'Server is running',
      modelServer: { status: 'error', error: error.message }
    });
  }
});

// Generate images endpoint
app.post('/api/generate', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { num_samples, label } = req.body;
    const numSamples = parseInt(num_samples) || 4;
    const weedLabel = label || 'cotton_weed';

    // Convert image to base64
    const imageBase64 = req.file.buffer.toString('base64');

    // Call FastAPI model server
    try {
      const modelResponse = await axios.post(`${MODEL_SERVER_URL}/generate`, {
        label: weedLabel,
        num_samples: numSamples,
        image_base64: imageBase64
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 300000 // 5 minutes timeout for generation
      });

      const generatedImages = modelResponse.data.images;

      // Save to database
      const generation = new Generation({
        inputImage: imageBase64,
        numSamples: numSamples,
        label: weedLabel,
        generatedImages: generatedImages,
      });
      await generation.save();

      res.json({
        success: true,
        images: generatedImages,
        generationId: generation._id
      });
    } catch (modelError) {
      console.error('Model server error:', modelError);
      
      // Check if it's a 503 Service Unavailable (model not loaded)
      if (modelError.response && modelError.response.status === 503) {
        return res.status(503).json({ 
          error: 'Model server is not ready. The AI models are not loaded. Please check the model server logs and restart it.',
          details: modelError.response.data?.detail || modelError.message 
        });
      }
      
      // Check if connection was refused (server not running)
      if (modelError.code === 'ECONNREFUSED') {
        return res.status(503).json({ 
          error: 'Cannot connect to model server. Please ensure the model server is running on port 8000.',
          details: modelError.message 
        });
      }
      
      return res.status(500).json({ 
        error: 'Failed to generate images. Model server may be unavailable.',
        details: modelError.response?.data?.detail || modelError.message 
      });
    }
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Get generation history
app.get('/api/history', async (req, res) => {
  try {
    const generations = await Generation.find().sort({ timestamp: -1 }).limit(10);
    res.json({ generations });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Model server URL: ${MODEL_SERVER_URL}`);
});

