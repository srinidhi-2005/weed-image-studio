import React, { useState, useEffect } from 'react';

function About() {
  const [activeTab, setActiveTab] = useState('architecture');
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
            // Unobserve after animation is triggered to avoid re-triggering
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe elements after they're rendered
    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach((el) => {
        if (el.id) {
          observer.observe(el);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [activeTab]);

  const architectureComponents = [
    {
      name: 'Transformer',
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      description: 'Captures long-range dependencies and contextual relationships in input images',
      color: 'from-blue-400 to-blue-600'
    },
    {
      name: 'Diffusion Model',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      description: 'Generates high-quality images through iterative denoising process',
      color: 'from-purple-400 to-purple-600'
    },
    {
      name: 'MRAR',
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      description: 'Multi-Reference Auto Regression enhances image quality through multi-resolution attention',
      color: 'from-green-400 to-green-600'
    }
  ];

  const trainingSteps = [
    { step: 'Data Collection', description: 'Comprehensive dataset of cotton weed images', progress: 100 },
    { step: 'Preprocessing', description: 'Image normalization and augmentation', progress: 100 },
    { step: 'Model Training', description: 'Progressive training with learning rate scheduling', progress: 100 },
    { step: 'Validation', description: 'Regular validation to monitor overfitting', progress: 100 },
    { step: 'Fine-tuning', description: 'Optimization on specific cotton weed classes', progress: 100 }
  ];

  const applications = [
    {
      title: 'Dataset Augmentation',
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      description: 'Generate additional training data for weed detection models'
    },
    {
      title: 'Research & Development',
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      description: 'Support agricultural research with synthetic but realistic images'
    },
    {
      title: 'Education',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      description: 'Create educational materials for farmers and students'
    },
    {
      title: 'Testing & Validation',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      description: 'Generate test cases for weed detection systems'
    }
  ];

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-primary-100/50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            About the <span className="gradient-text">Model</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn about our AI model architecture, training process, and purpose
          </p>
        </div>

        {/* Interactive Tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          {[
            { id: 'architecture', label: 'Architecture', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
            { id: 'training', label: 'Training', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { id: 'purpose', label: 'Purpose', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { id: 'technical', label: 'Technical', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
              aria-label={`Switch to ${tab.label} tab`}
              className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/50'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-primary-200 hover:border-primary-400'
              }`}
            >
              <svg className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-primary-600 group-hover:rotate-12 transition-transform'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Architecture Tab */}
        {activeTab === 'architecture' && (
          <div className="space-y-8 animate-fadeInUp" data-animate id="architecture">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border border-primary-100/50">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
                Model Architecture
              </h2>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                Our cotton weed image generation model combines three powerful deep learning architectures
                to understand complex patterns and generate realistic variations of input images.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {architectureComponents.map((component, index) => (
                  <div
                    key={component.name}
                    className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-primary-200 hover:border-primary-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer"
                    onClick={() => toggleSection(index)}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${component.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={component.icon} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {component.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {component.description}
                    </p>
                    {expandedSection === index && (
                      <div className="mt-4 pt-4 border-t border-primary-200 animate-fadeIn">
                        <p className="text-gray-700 text-sm">
                          This component plays a crucial role in processing spatial relationships and generating
                          high-fidelity image outputs through advanced neural network mechanisms.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-primary-50 to-green-50 rounded-2xl p-6 border border-primary-200">
                <p className="text-gray-700 leading-relaxed">
                  <strong className="text-primary-700">Hybrid Approach:</strong> This hybrid architecture allows the model to understand
                  the complex patterns and characteristics of cotton weed images, enabling it to generate realistic
                  and diverse variations of input images with exceptional quality and fidelity.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div className="space-y-8 animate-fadeInUp" data-animate id="training">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border border-primary-100/50">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                Training Process
              </h2>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                The model was trained on a comprehensive dataset of cotton weed images, carefully curated
                and preprocessed to ensure high quality and diversity.
              </p>

              {/* Interactive Timeline */}
              <div className="space-y-4 mb-8">
                {trainingSteps.map((step, index) => (
                  <div key={step.step} className="relative">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                          index === 0 ? 'bg-gradient-to-br from-green-400 to-green-600' :
                          index === trainingSteps.length - 1 ? 'bg-gradient-to-br from-primary-400 to-primary-600' :
                          'bg-gradient-to-br from-blue-400 to-blue-600'
                        }`}>
                          {index + 1}
                        </div>
                        {index < trainingSteps.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-full bg-gradient-to-b from-primary-300 to-primary-200"></div>
                        )}
                      </div>
                      <div className="flex-1 bg-gradient-to-r from-white to-gray-50 rounded-xl p-5 border border-primary-200 hover:border-primary-400 transition-all duration-300 hover:shadow-lg">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{step.step}</h3>
                        <p className="text-gray-600 mb-3">{step.description}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-1000"
                            style={{ width: `${step.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* FID Score Card */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">FID Score</h3>
                    <p className="text-primary-100">Model Performance Metric</p>
                  </div>
                  <div className="text-5xl font-extrabold">50.00</div>
                </div>
                <p className="mt-4 text-primary-100">
                  Demonstrates the model's ability to generate high-quality, realistic images that closely
                  match the distribution of the training data.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Purpose Tab */}
        {activeTab === 'purpose' && (
          <div className="space-y-8 animate-fadeInUp" data-animate id="purpose">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border border-primary-100/50">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Purpose & Applications
              </h2>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                This AI image generation system is designed specifically for agricultural research and
                cotton weed management, providing powerful tools for various applications.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {applications.map((app) => (
                  <div
                    key={app.title}
                    className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-primary-200 hover:border-primary-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={app.icon} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {app.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {app.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-50 to-primary-50 rounded-2xl p-6 border border-primary-200">
                <p className="text-gray-700 leading-relaxed">
                  <strong className="text-primary-700">Impact:</strong> By generating diverse and realistic cotton weed images,
                  this system helps improve the robustness and generalization of agricultural AI systems, ultimately
                  contributing to more effective weed management strategies and sustainable farming practices.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Technical Tab */}
        {activeTab === 'technical' && (
          <div className="space-y-8 animate-fadeInUp" data-animate id="technical">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 border border-primary-100/50">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </span>
                Technical Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Model Type', value: 'Transformer + Diffusion + MRAR', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', color: 'from-blue-400 to-blue-600' },
                  { title: 'Checkpoint Format', value: 'PyTorch (.pth)', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12', color: 'from-purple-400 to-purple-600' },
                  { title: 'Training Dataset', value: 'CottonWeedID15 Images', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'from-green-400 to-green-600' },
                  { title: 'FID Score', value: '50.00', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'from-orange-400 to-orange-600' }
                ].map((detail) => (
                  <div
                    key={detail.title}
                    className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-primary-200 hover:border-primary-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${detail.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={detail.icon} />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 text-lg">{detail.title}</h3>
                    <p className="text-gray-700 font-semibold">{detail.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default About;

