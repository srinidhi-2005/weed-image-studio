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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-image-studio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
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
      return res.status(500).json({ 
        error: 'Failed to generate images. Model server may be unavailable.',
        details: modelError.message 
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

