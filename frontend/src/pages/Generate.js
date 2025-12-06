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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Generate Images</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload a cotton weed image and generate high-quality variations using our advanced AI model
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-primary-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Input Image
            </h2>
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </h2>
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
        <div className="bg-white rounded-xl shadow-lg p-8 border border-primary-100">
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

