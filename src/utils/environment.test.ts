import { describe, it, expect } from 'vitest';
import {
  isDevelopment,
  isProduction,
  isDeploymentGuideEditorEnabled,
  getEnvironment,
} from './environment';

describe('Environment Utilities', () => {
  describe('Environment Detection', () => {
    it('should detect development environment correctly', () => {
      // In test environment, we're typically in development mode
      const dev = isDevelopment();
      const prod = isProduction();

      // One should be true, the other false
      expect(dev).toBe(!prod);
    });

    it('should return consistent environment name', () => {
      const env = getEnvironment();
      expect(['development', 'production']).toContain(env);
    });

    it('should enable editor in development mode', () => {
      const enabled = isDeploymentGuideEditorEnabled();
      const dev = isDevelopment();

      // Editor should be enabled if and only if we're in development
      expect(enabled).toBe(dev);
    });

    it('should have consistent behavior across functions', () => {
      const dev = isDevelopment();
      const prod = isProduction();
      const enabled = isDeploymentGuideEditorEnabled();
      const env = getEnvironment();

      // Verify logical consistency
      expect(dev).toBe(!prod);
      expect(enabled).toBe(dev);
      expect(env).toBe(dev ? 'development' : 'production');
    });
  });
});
