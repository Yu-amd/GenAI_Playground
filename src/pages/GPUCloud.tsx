import React from 'react';

const GPUCloud: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">GPU Cloud Access</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resource Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available GPUs</span>
              <span className="text-2xl font-bold text-blue-600">4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Sessions</span>
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
              Start New Session
            </button>
            <button className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
              View Active Sessions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPUCloud; 