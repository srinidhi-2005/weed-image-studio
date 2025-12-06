import React, { useState, useRef } from 'react';
import axios from 'axios';
import JSZip from 'jszip';

function Generate() {
  const [inputImage, setInputImage] = useState(null);
  const [inputImagePreview, setInputImagePreview] = useState(null);
  const [numSamples, setNumSamples] = useState(4);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      setInputImage(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please upload a valid image file');
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
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
      formData.append('label', 'cotton_weed');

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
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-primary-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Generate <span className="gradient-text">Images</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload a cotton weed image and generate high-quality variations using our advanced AI model
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 mb-8 border border-primary-100/50 animate-fadeInUp">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                Input Image
              </h2>
              
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? 'border-primary-500 bg-primary-50 scale-105'
                    : inputImagePreview
                    ? 'border-primary-300 bg-primary-50/50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                {!inputImagePreview ? (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        {isDragging ? 'Drop your image here' : 'Click or drag to upload'}
                      </p>
                      <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <img
                      src={inputImagePreview}
                      alt="Input preview"
                      className="w-full h-auto rounded-xl shadow-lg border-2 border-primary-200 group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInputImage(null);
                        setInputImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Remove image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Settings Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                Settings
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Number of Images to Generate
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[4, 8, 16].map((num) => (
                    <button
                      key={num}
                      onClick={() => setNumSamples(num)}
                      className={`py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                        numSamples === num
                          ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={loading || !inputImage}
                className="group w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform"
                aria-label="Generate images"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Generate Images
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 shadow-lg animate-fadeIn">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-16 animate-fadeIn">
            <div className="inline-block relative">
              <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-6 text-xl font-semibold text-gray-700">Generating images...</p>
            <p className="mt-2 text-gray-500">This may take a moment. Please wait.</p>
          </div>
        )}

        {generatedImages.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border border-primary-100/50 animate-fadeInUp">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Generated Images
                </h2>
                <p className="text-gray-600">
                  {generatedImages.length} image{generatedImages.length > 1 ? 's' : ''} ready
                </p>
              </div>
              <button
                onClick={downloadAllImages}
                className="group mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                aria-label="Download all images as ZIP"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download All as ZIP
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {generatedImages.map((image, index) => {
                const imageSrc = image.startsWith('data:') 
                  ? image 
                  : `data:image/png;base64,${image}`;
                return (
                  <div
                    key={`generated-image-${index}`}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover-lift"
                  >
                    <div className="aspect-square overflow-hidden bg-gray-100 relative">
                      <img
                        src={imageSrc}
                        alt={`Generated ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="p-4">
                      <button
                        onClick={() => downloadImage(image, index)}
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                        aria-label={`Download generated image ${index + 1}`}
                      >
                        <span className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Generate;
