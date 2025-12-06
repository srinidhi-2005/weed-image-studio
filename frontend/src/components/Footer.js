import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-white border-t-2 border-primary-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary-600 mb-4">AI Image Studio</h3>
            <p className="text-gray-600 mb-4 max-w-md">
              Advanced AI-powered cotton weed image generation using Transformer + Diffusion + MRAR deep learning technology. 
              Generate high-quality, realistic image variations for agricultural research and applications.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-600 transition duration-200">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-1.688-.013-3.312-2.803.609-3.393-1.352-3.393-1.352-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.624-5.373-12-12-12z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-600 transition duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/generate" className="text-gray-600 hover:text-primary-600 transition duration-200">
                  Generate Images
                </Link>
              </li>
              <li>
                <Link to="/metrics" className="text-gray-600 hover:text-primary-600 transition duration-200">
                  Metrics
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary-600 transition duration-200">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact/Info */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Information</h4>
            <ul className="space-y-2 text-gray-600">
              <li>AI Image Generation</li>
              <li>Cotton Weed Dataset</li>
              <li>Deep Learning Model</li>
              <li>Research & Development</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} AI Image Studio. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm mt-4 md:mt-0">
              Built with React, Express, FastAPI & PyTorch
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

