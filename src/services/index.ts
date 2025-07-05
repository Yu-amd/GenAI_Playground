// Import all cloud provider adapters to register them with the central controller
import './AmdDeveloperCloudAdapter';
import './OracleCloudAdapter';
import './AzureCloudAdapter';
import './VultrCloudAdapter';
import './HotAisleCloudAdapter';
import './TensorWaveCloudAdapter';

// Export the central controller for use in components
export { centralDeploymentController } from './CentralDeploymentController'; 