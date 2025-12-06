import React, { useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';

function Generate() {
  const [inputImage, setInputImage] = useState(null);
  const [inputImagePreview, setInputImagePreview] = useState(null);
  const [numSamples, setNumSamples] = useState(4);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInputImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!inputImage) {
      setError('Please upload an input image');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const formData = new FormData();
      formData.append('image', inputImage);
      formData.append('num_samples', numSamples);
      formData.append('label', 'cotton_weed'); // Default label

      const response = await axios.post('http://localhost:5000/api/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setGeneratedImages(response.data.images);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate images. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (imageData, index) => {
    const link = document.createElement('a');
    // Handle both base64 strings and data URLs
    const base64Data = imageData.startsWith('data:') 
      ? imageData.split(',')[1] 
      : imageData;
    link.href = `data:image/png;base64,${base64Data}`;
    link.download = `generated_image_${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = async () => {
    if (generatedImages.length === 0) return;

    const zip = new JSZip();
    
    for (let i = 0; i < generatedImages.length; i++) {
      const imageData = generatedImages[i];
      const base64Data = imageData.split(',')[1] || imageData;
      zip.file(`generated_image_${i + 1}.png`, base64Data, { base64: true });
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = 'generated_images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Generate Images</h1>
        <p className="text-gray-600">Upload a cotton weed image and generate variations using AI</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Input Image</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>
            {inputImagePreview && (
              <div className="mt-4">
                <img
                  src={inputImagePreview}
                  alt="Input preview"
                  className="w-full h-auto rounded-lg shadow-md border-2 border-primary-200"
                />
              </div>
            )}
          </div>

          {/* Settings Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Settings</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Images to Generate
              </label>
              <select
                value={numSamples}
                onChange={(e) => setNumSamples(parseInt(e.target.value))}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={16}>16</option>
              </select>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !inputImage}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? 'Generating...' : 'Generate Images'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {generatedImages.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Generated Images ({generatedImages.length})
            </h2>
            <button
              onClick={downloadAllImages}
              className="bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition duration-200 shadow-md hover:shadow-lg"
            >
              Download All as ZIP
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {generatedImages.map((image, index) => {
              // Handle both base64 strings and data URLs
              const imageSrc = image.startsWith('data:') 
                ? image 
                : `data:image/png;base64,${image}`;
              return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-200 overflow-hidden border border-gray-200"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={imageSrc}
                    alt={`Generated ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <button
                    onClick={() => downloadImage(image, index)}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition duration-200"
                  >
                    Download
                  </button>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Generating images... This may take a moment.</p>
        </div>
      )}
    </div>
  );
}

export default Generate;

