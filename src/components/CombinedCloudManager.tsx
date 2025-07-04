import React from 'react';
import { GPUCloudManager } from './GPUCloudManager';
import { ModelDeploymentManager } from './ModelDeploymentManager';

const CombinedCloudManager: React.FC = () => {
  return (
    <div className="space-y-12">
      <GPUCloudManager />
      <ModelDeploymentManager />
    </div>
  );
};

export default CombinedCloudManager; 