import React, { useState, useEffect } from 'react';
import {
  ComputerDesktopIcon,
  CloudIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import type { InferenceProvider } from '../services/inferenceServiceFactory';
import {
  inferenceService,
  getCurrentProvider,
  switchToCloud,
  switchToLMStudio,
  isCloudAvailable,
  isLMStudioAvailable,
} from '../services/inferenceServiceFactory';

interface InferenceProviderSelectorProps {
  onProviderChange?: (provider: InferenceProvider) => void;
  showHealthStatus?: boolean;
  className?: string;
}

export const InferenceProviderSelector: React.FC<
  InferenceProviderSelectorProps
> = ({ onProviderChange, showHealthStatus = true, className = '' }) => {
  const [currentProvider, setCurrentProvider] =
    useState<InferenceProvider>(getCurrentProvider());
  const [healthStatus, setHealthStatus] = useState<
    Record<
      InferenceProvider,
      {
        isHealthy: boolean;
        responseTime?: number;
        error?: string;
      }
    >
  >({
    'lm-studio': { isHealthy: false },
    cloud: { isHealthy: false },
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    updateHealthStatus();
    const interval = setInterval(updateHealthStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const updateHealthStatus = async () => {
    try {
      const status = await inferenceService.getHealthStatus();
      setHealthStatus(status);
    } catch (error) {
      console.error('Failed to update health status:', error);
    }
  };

  const handleProviderSwitch = async (provider: InferenceProvider) => {
    try {
      if (provider === 'cloud') {
        switchToCloud();
      } else {
        switchToLMStudio();
      }
      setCurrentProvider(provider);
      onProviderChange?.(provider);
    } catch (error) {
      console.error('Failed to switch provider:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await updateHealthStatus();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getHealthIcon = (provider: InferenceProvider) => {
    const health = healthStatus[provider];
    if (!health)
      return <ExclamationTriangleIcon className='w-4 h-4 text-yellow-500' />;

    if (health.isHealthy) {
      return <CheckCircleIcon className='w-4 h-4 text-green-500' />;
    } else {
      return <XCircleIcon className='w-4 h-4 text-red-500' />;
    }
  };

  const getHealthText = (provider: InferenceProvider) => {
    const health = healthStatus[provider];
    if (!health) return 'Unknown';

    if (health.isHealthy) {
      return health.responseTime ? `${health.responseTime}ms` : 'Healthy';
    } else {
      return health.error || 'Unhealthy';
    }
  };

  const isProviderAvailable = (provider: InferenceProvider) => {
    switch (provider) {
      case 'lm-studio':
        return isLMStudioAvailable();
      case 'cloud':
        return isCloudAvailable();
      default:
        return false;
    }
  };

  return (
    <div className={`bg-gray-900 rounded-xl p-4 ${className}`}>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-white'>Inference Provider</h3>
        {showHealthStatus && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className='p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-50'
            title='Refresh Health Status'
          >
            {isRefreshing ? (
              <ArrowPathIcon className='w-4 h-4 animate-spin' />
            ) : (
              <ArrowPathIcon className='w-4 h-4' />
            )}
          </button>
        )}
      </div>

      <div className='space-y-3'>
        {/* LM Studio Provider */}
        <div className='relative'>
          <button
            onClick={() => handleProviderSwitch('lm-studio')}
            disabled={!isProviderAvailable('lm-studio')}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
              currentProvider === 'lm-studio'
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className='flex items-center space-x-3'>
              <ComputerDesktopIcon className='w-5 h-5' />
              <div className='text-left'>
                <div className='font-medium'>LM Studio</div>
                <div className='text-sm opacity-75'>Local inference server</div>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              {showHealthStatus && (
                <div className='flex items-center space-x-1 text-xs'>
                  {getHealthIcon('lm-studio')}
                  <span>{getHealthText('lm-studio')}</span>
                </div>
              )}
              {currentProvider === 'lm-studio' && (
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
              )}
            </div>
          </button>
          {!isProviderAvailable('lm-studio') && (
            <div className='absolute inset-0 bg-gray-800/50 rounded-lg flex items-center justify-center'>
              <span className='text-xs text-gray-400'>Not configured</span>
            </div>
          )}
        </div>

        {/* Cloud Provider */}
        <div className='relative'>
          <button
            onClick={() => handleProviderSwitch('cloud')}
            disabled={!isProviderAvailable('cloud')}
            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
              currentProvider === 'cloud'
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className='flex items-center space-x-3'>
              <CloudIcon className='w-5 h-5' />
              <div className='text-left'>
                <div className='font-medium'>Cloud Inference</div>
                <div className='text-sm opacity-75'>
                  Multi-provider cloud inference
                </div>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              {showHealthStatus && (
                <div className='flex items-center space-x-1 text-xs'>
                  {getHealthIcon('cloud')}
                  <span>{getHealthText('cloud')}</span>
                </div>
              )}
              {currentProvider === 'cloud' && (
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
              )}
            </div>
          </button>
          {!isProviderAvailable('cloud') && (
            <div className='absolute inset-0 bg-gray-800/50 rounded-lg flex items-center justify-center'>
              <span className='text-xs text-gray-400'>
                No providers configured
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Current Provider Info */}
      <div className='mt-4 p-3 bg-gray-800 rounded-lg'>
        <div className='text-sm text-gray-400 mb-1'>Current Provider</div>
        <div className='flex items-center space-x-2'>
          {currentProvider === 'lm-studio' ? (
            <ComputerDesktopIcon className='w-4 h-4 text-blue-400' />
          ) : (
            <CloudIcon className='w-4 h-4 text-blue-400' />
          )}
          <span className='text-white font-medium'>
            {currentProvider === 'lm-studio' ? 'LM Studio' : 'Cloud Inference'}
          </span>
          {showHealthStatus && (
            <div className='flex items-center space-x-1 text-xs'>
              {getHealthIcon(currentProvider)}
              <span className='text-gray-400'>
                {getHealthText(currentProvider)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
