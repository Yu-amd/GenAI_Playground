/**
 * Environment detection utilities
 */

/**
 * Check if the current build is a development/debug build
 * @returns true if running in development mode
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV === true;
};

/**
 * Check if the current build is a production build
 * @returns true if running in production mode
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD === true;
};

/**
 * Check if the deployment guide editor should be enabled
 * Only enabled in development builds for security
 * @returns true if the editor should be enabled
 */
export const isDeploymentGuideEditorEnabled = (): boolean => {
  return isDevelopment();
};

/**
 * Get the current environment name
 * @returns 'development' | 'production'
 */
export const getEnvironment = (): 'development' | 'production' => {
  return isDevelopment() ? 'development' : 'production';
};
