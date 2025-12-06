import React from 'react';

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-primary-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            About the <span className="gradient-text">Model</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn about our AI model architecture, training process, and purpose
          </p>
        </div>

        {/* Architecture Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 mb-8 border border-primary-100/50 animate-fadeInUp">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Model Architecture</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            Our cotton weed image generation model combines three powerful deep learning architectures:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li><strong>Transformer:</strong> Captures long-range dependencies and contextual relationships in the input images</li>
            <li><strong>Diffusion Model:</strong> Generates high-quality images through iterative denoising process</li>
            <li><strong>MRAR (Multi-Reference Auto Regression):</strong> Enhances image quality through multi-resolution attention mechanisms</li>
          </ul>
          <p className="text-gray-700">
            This hybrid architecture allows the model to understand the complex patterns and characteristics of cotton weed images,
            enabling it to generate realistic and diverse variations of input images.
          </p>
        </div>
      </div>

        {/* Training Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 mb-8 border border-primary-100/50 animate-fadeInUp">
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
            The model achieved a FID score of 50.00, demonstrating its ability to generate high-quality, realistic images
            that closely match the distribution of the training data.
          </p>
        </div>
      </div>

        {/* Purpose Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 mb-8 border border-primary-100/50 animate-fadeInUp">
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
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border border-primary-100/50 animate-fadeInUp">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Technical Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 hover-lift border border-primary-200">
            <h3 className="font-semibold text-gray-800 mb-2">Model Type</h3>
            <p className="text-gray-700">Transformer + Diffusion + MRAR</p>
          </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 hover-lift border border-primary-200">
              <h3 className="font-bold text-gray-800 mb-2">Checkpoint Format</h3>
              <p className="text-gray-700">PyTorch (.pth)</p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 hover-lift border border-primary-200">
              <h3 className="font-bold text-gray-800 mb-2">Training Dataset</h3>
              <p className="text-gray-700">CottonWeedID15 Images</p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 hover-lift border border-primary-200">
            <h3 className="font-semibold text-gray-800 mb-2">FID Score</h3>
            <p className="text-gray-700">50.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;

