import React from 'react';

function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">About the Model</h1>
        <p className="text-gray-600">Learn about our AI model architecture and training process</p>
      </div>

      {/* Architecture Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Model Architecture</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            Our cotton weed image generation model combines three powerful deep learning architectures:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li><strong>Transformer:</strong> Captures long-range dependencies and contextual relationships in the input images</li>
            <li><strong>Diffusion Model:</strong> Generates high-quality images through iterative denoising process</li>
            <li><strong>VAE (Variational Autoencoder):</strong> Encodes images into a latent space and decodes them back, enabling efficient generation</li>
          </ul>
          <p className="text-gray-700">
            This hybrid architecture allows the model to understand the complex patterns and characteristics of cotton weed images,
            enabling it to generate realistic and diverse variations of input images.
          </p>
        </div>
      </div>

      {/* Training Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Training Process</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            The model was trained on a comprehensive dataset of cotton weed images, carefully curated and preprocessed
            to ensure high quality and diversity. The training process involved:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li>Data augmentation to increase dataset diversity</li>
            <li>Progressive training with learning rate scheduling</li>
            <li>Regular validation to monitor overfitting</li>
            <li>Checkpoint saving at regular intervals</li>
            <li>Fine-tuning on specific cotton weed classes</li>
          </ul>
          <p className="text-gray-700">
            The model achieved a FID score of 21.8, demonstrating its ability to generate high-quality, realistic images
            that closely match the distribution of the training data.
          </p>
        </div>
      </div>

      {/* Purpose Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Purpose & Applications</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            This AI image generation system is designed specifically for agricultural research and cotton weed management.
            The primary purposes include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li><strong>Dataset Augmentation:</strong> Generate additional training data for weed detection and classification models</li>
            <li><strong>Research & Development:</strong> Support agricultural research by providing synthetic but realistic weed images</li>
            <li><strong>Education:</strong> Create educational materials for farmers and agricultural students</li>
            <li><strong>Testing & Validation:</strong> Generate test cases for weed detection systems</li>
          </ul>
          <p className="text-gray-700">
            By generating diverse and realistic cotton weed images, this system helps improve the robustness and
            generalization of agricultural AI systems, ultimately contributing to more effective weed management strategies.
          </p>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Technical Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Model Type</h3>
            <p className="text-gray-700">Transformer + Diffusion + VAE</p>
          </div>
          <div className="bg-primary-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Checkpoint Format</h3>
            <p className="text-gray-700">PyTorch (.pth)</p>
          </div>
          <div className="bg-primary-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Training Dataset</h3>
            <p className="text-gray-700">Cotton Weed Images</p>
          </div>
          <div className="bg-primary-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">FID Score</h3>
            <p className="text-gray-700">21.8</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;

