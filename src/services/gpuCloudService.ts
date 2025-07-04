

// Types for GPU Cloud Management
export interface GPUInstance {
  id: string;
  name: string;
  provider: string;
  gpuType: string;
  status: 'running' | 'stopped' | 'starting' | 'stopping' | 'error';
  region: string;
  ipAddress?: string;
  sshPort?: number;
  createdAt: Date;
  lastStarted?: Date;
  totalRuntime: number; // in hours
  costPerHour: number;
  totalCost: number;
  specs: {
    vram: string;
    computeUnits: string;
    systemMemory: string;
    cpuCores: string;
  };
  tags: string[];
}

export interface CloudProvider {
  id: string;
  name: string;
  type: 'amd-developer' | 'vultr' | 'oracle' | 'azure' | 'ibm' | 'hot-aisle' | 'tensorwave';
  apiEndpoint?: string;
  apiKey?: string;
  regions: string[];
  supportedGPUs: string[];
  pricing: Record<string, number>; // GPU type -> cost per hour
  status: 'available' | 'unavailable' | 'error';
}

export interface InstanceMetrics {
  instanceId: string;
  timestamp: Date;
  gpuUtilization: number;
  memoryUtilization: number;
  temperature: number;
  powerConsumption: number;
  networkIn: number;
  networkOut: number;
}

export interface CostAnalysis {
  totalCost: number;
  costByProvider: Record<string, number>;
  costByGPU: Record<string, number>;
  costByMonth: Record<string, number>;
  projectedMonthlyCost: number;
  savingsRecommendations: string[];
}

export class GPUCloudService {
  private providers: Map<string, CloudProvider> = new Map();
  private instances: Map<string, GPUInstance> = new Map();
  private metrics: Map<string, InstanceMetrics[]> = new Map();
  private config: {
    defaultRegion: string;
    costAlertThreshold: number;
    autoStopIdleInstances: boolean;
    idleTimeoutMinutes: number;
  };

  constructor() {
    this.config = {
      defaultRegion: 'us-east-1',
      costAlertThreshold: 100, // $100
      autoStopIdleInstances: true,
      idleTimeoutMinutes: 30,
    };
    
    this.initializeProviders();
    this.loadInstances();
  }

  private initializeProviders(): void {
    const defaultProviders: CloudProvider[] = [
      {
        id: 'amd-developer',
        name: 'AMD Developer Cloud',
        type: 'amd-developer',
        regions: ['us-east', 'us-west', 'europe', 'asia-pacific'],
        supportedGPUs: ['MI300X', 'MI250X', 'MI100'],
        pricing: {
          'MI300X': 2.50,
          'MI250X': 1.80,
          'MI100': 0.95,
        },
        status: 'available',
      },
      {
        id: 'vultr',
        name: 'Vultr',
        type: 'vultr',
        regions: ['us-east', 'us-west', 'europe', 'asia'],
        supportedGPUs: ['MI325X', 'MI300X'],
        pricing: {
          'MI325X': 3.20,
          'MI300X': 2.80,
        },
        status: 'available',
      },
      {
        id: 'oracle',
        name: 'Oracle Cloud Infrastructure',
        type: 'oracle',
        regions: ['us-east', 'us-west', 'europe', 'asia-pacific'],
        supportedGPUs: ['MI300X', 'MI250X'],
        pricing: {
          'MI300X': 3.50,
          'MI250X': 2.20,
        },
        status: 'available',
      },
      {
        id: 'azure',
        name: 'Microsoft Azure',
        type: 'azure',
        regions: ['global'],
        supportedGPUs: ['MI250', 'MI210'],
        pricing: {
          'MI250': 2.10,
          'MI210': 1.60,
        },
        status: 'available',
      },
      {
        id: 'ibm',
        name: 'IBM Cloud',
        type: 'ibm',
        regions: ['us-east', 'us-south', 'europe', 'asia-pacific'],
        supportedGPUs: ['EPYC_7763', 'EPYC_7543'],
        pricing: {
          'EPYC_7763': 1.20,
          'EPYC_7543': 0.95,
        },
        status: 'available',
      },
      {
        id: 'hot-aisle',
        name: 'Hot Aisle',
        type: 'hot-aisle',
        regions: ['us-east', 'us-west'],
        supportedGPUs: ['MI300X', 'MI250X'],
        pricing: {
          'MI300X': 2.90,
          'MI250X': 2.00,
        },
        status: 'available',
      },
      {
        id: 'tensorwave',
        name: 'TensorWave',
        type: 'tensorwave',
        regions: ['us-east', 'us-west'],
        supportedGPUs: ['MI300X', 'MI250X'],
        pricing: {
          'MI300X': 3.10,
          'MI250X': 2.30,
        },
        status: 'available',
      },
    ];

    defaultProviders.forEach(provider => {
      this.providers.set(provider.id, provider);
    });
  }

  private loadInstances(): void {
    // Load instances from localStorage or API
    const savedInstances = localStorage.getItem('gpu-cloud-instances');
    if (savedInstances) {
      try {
        const instances = JSON.parse(savedInstances);
        instances.forEach((instance: any) => {
          this.instances.set(instance.id, {
            ...instance,
            createdAt: new Date(instance.createdAt),
            lastStarted: instance.lastStarted ? new Date(instance.lastStarted) : undefined,
          });
        });
      } catch (error) {
        console.error('Failed to load instances:', error);
      }
    } else {
      // Add sample instances for demonstration
      this.addSampleInstances();
    }
  }

  private addSampleInstances(): void {
    const sampleInstances: GPUInstance[] = [
      {
        id: 'inst-001',
        name: 'LLM-Training-01',
        provider: 'AMD Developer Cloud',
        gpuType: 'MI300X',
        status: 'running',
        region: 'us-east',
        ipAddress: '192.168.1.100',
        sshPort: 22,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        lastStarted: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        totalRuntime: 22.5,
        costPerHour: 2.50,
        totalCost: 56.25,
        specs: {
          vram: '192GB',
          computeUnits: '1536',
          systemMemory: '1TB',
          cpuCores: '128',
        },
        tags: ['training', 'llm', 'production'],
      },
      {
        id: 'inst-002',
        name: 'Inference-Server-01',
        provider: 'Vultr',
        gpuType: 'MI325X',
        status: 'stopped',
        region: 'us-west',
        ipAddress: '192.168.1.101',
        sshPort: 22,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        lastStarted: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        totalRuntime: 45.2,
        costPerHour: 3.20,
        totalCost: 144.64,
        specs: {
          vram: '192GB',
          computeUnits: '1536',
          systemMemory: '1TB',
          cpuCores: '128',
        },
        tags: ['inference', 'api', 'staging'],
      },
      {
        id: 'inst-003',
        name: 'Research-Cluster-01',
        provider: 'Oracle Cloud Infrastructure',
        gpuType: 'MI250X',
        status: 'running',
        region: 'europe',
        ipAddress: '192.168.1.102',
        sshPort: 22,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        lastStarted: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        totalRuntime: 168.0,
        costPerHour: 2.20,
        totalCost: 369.60,
        specs: {
          vram: '128GB',
          computeUnits: '1024',
          systemMemory: '512GB',
          cpuCores: '64',
        },
        tags: ['research', 'cluster', 'long-running'],
      },
    ];

    sampleInstances.forEach(instance => {
      this.instances.set(instance.id, instance);
    });
    
    // Save the sample instances
    this.saveInstances();
  }

  private saveInstances(): void {
    const instancesArray = Array.from(this.instances.values());
    localStorage.setItem('gpu-cloud-instances', JSON.stringify(instancesArray));
  }

  // Provider Management
  getProviders(): CloudProvider[] {
    return Array.from(this.providers.values());
  }

  getProvider(id: string): CloudProvider | undefined {
    return this.providers.get(id);
  }

  addProvider(provider: CloudProvider): void {
    this.providers.set(provider.id, provider);
  }

  updateProvider(id: string, updates: Partial<CloudProvider>): void {
    const provider = this.providers.get(id);
    if (provider) {
      this.providers.set(id, { ...provider, ...updates });
    }
  }

  // Instance Management
  getInstances(): GPUInstance[] {
    return Array.from(this.instances.values());
  }

  getInstance(id: string): GPUInstance | undefined {
    return this.instances.get(id);
  }

  async createInstance(config: {
    name: string;
    provider: string;
    gpuType: string;
    region: string;
    tags?: string[];
  }): Promise<GPUInstance> {
    const provider = this.providers.get(config.provider);
    if (!provider) {
      throw new Error(`Provider ${config.provider} not found`);
    }

    if (!provider.supportedGPUs.includes(config.gpuType)) {
      throw new Error(`GPU type ${config.gpuType} not supported by ${provider.name}`);
    }

    const instance: GPUInstance = {
      id: `instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: config.name,
      provider: config.provider,
      gpuType: config.gpuType,
      status: 'starting',
      region: config.region,
      createdAt: new Date(),
      totalRuntime: 0,
      costPerHour: provider.pricing[config.gpuType] || 0,
      totalCost: 0,
      specs: this.getGPUSpecs(config.gpuType),
      tags: config.tags || [],
    };

    this.instances.set(instance.id, instance);
    this.saveInstances();

    // Simulate instance creation
    setTimeout(() => {
      this.updateInstanceStatus(instance.id, 'running');
    }, 5000);

    return instance;
  }

  async startInstance(id: string): Promise<void> {
    const instance = this.instances.get(id);
    if (!instance) {
      throw new Error(`Instance ${id} not found`);
    }

    this.updateInstanceStatus(id, 'starting');

    // Simulate instance startup
    setTimeout(() => {
      this.updateInstanceStatus(id, 'running');
      this.updateInstance(id, {
        lastStarted: new Date(),
      });
    }, 3000);
  }

  async stopInstance(id: string): Promise<void> {
    const instance = this.instances.get(id);
    if (!instance) {
      throw new Error(`Instance ${id} not found`);
    }

    this.updateInstanceStatus(id, 'stopping');

    // Calculate runtime and cost
    if (instance.lastStarted) {
      const runtime = (Date.now() - instance.lastStarted.getTime()) / (1000 * 60 * 60); // hours
      const cost = runtime * instance.costPerHour;
      
      this.updateInstance(id, {
        totalRuntime: instance.totalRuntime + runtime,
        totalCost: instance.totalCost + cost,
      });
    }

    // Simulate instance stop
    setTimeout(() => {
      this.updateInstanceStatus(id, 'stopped');
    }, 2000);
  }

  async deleteInstance(id: string): Promise<void> {
    const instance = this.instances.get(id);
    if (!instance) {
      throw new Error(`Instance ${id} not found`);
    }

    if (instance.status === 'running') {
      await this.stopInstance(id);
    }

    this.instances.delete(id);
    this.saveInstances();
  }

  private updateInstanceStatus(id: string, status: GPUInstance['status']): void {
    const instance = this.instances.get(id);
    if (instance) {
      instance.status = status;
      this.saveInstances();
    }
  }

  private updateInstance(id: string, updates: Partial<GPUInstance>): void {
    const instance = this.instances.get(id);
    if (instance) {
      Object.assign(instance, updates);
      this.saveInstances();
    }
  }

  // Metrics and Monitoring
  async getInstanceMetrics(id: string, timeRange: '1h' | '24h' | '7d' = '1h'): Promise<InstanceMetrics[]> {
    const metrics = this.metrics.get(id) || [];
    const now = new Date();
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
    }[timeRange];

    return metrics.filter(m => now.getTime() - m.timestamp.getTime() <= timeRangeMs);
  }

  async addMetrics(id: string, metrics: Omit<InstanceMetrics, 'timestamp'>): Promise<void> {
    const instanceMetrics = this.metrics.get(id) || [];
    instanceMetrics.push({
      ...metrics,
      timestamp: new Date(),
    });

    // Keep only last 1000 metrics per instance
    if (instanceMetrics.length > 1000) {
      instanceMetrics.splice(0, instanceMetrics.length - 1000);
    }

    this.metrics.set(id, instanceMetrics);
  }

  // Cost Analysis
  getCostAnalysis(): CostAnalysis {
    const instances = this.getInstances();
    const totalCost = instances.reduce((sum, instance) => sum + instance.totalCost, 0);
    
    const costByProvider: Record<string, number> = {};
    const costByGPU: Record<string, number> = {};
    const costByMonth: Record<string, number> = {};

    instances.forEach(instance => {
      // Cost by provider
      costByProvider[instance.provider] = (costByProvider[instance.provider] || 0) + instance.totalCost;
      
      // Cost by GPU type
      costByGPU[instance.gpuType] = (costByGPU[instance.gpuType] || 0) + instance.totalCost;
      
      // Cost by month
      const month = instance.createdAt.toISOString().substring(0, 7); // YYYY-MM
      costByMonth[month] = (costByMonth[month] || 0) + instance.totalCost;
    });

    // Calculate projected monthly cost
    const runningInstances = instances.filter(i => i.status === 'running');
    const projectedMonthlyCost = runningInstances.reduce((sum, instance) => {
      return sum + (instance.costPerHour * 24 * 30); // 30 days
    }, 0);

    // Generate savings recommendations
    const savingsRecommendations: string[] = [];
    const idleInstances = instances.filter(i => i.status === 'running' && i.totalRuntime > 24);
    if (idleInstances.length > 0) {
      savingsRecommendations.push(`Stop ${idleInstances.length} idle instances to save ~$${idleInstances.reduce((sum, i) => sum + i.costPerHour * 24, 0).toFixed(2)}/day`);
    }

    return {
      totalCost,
      costByProvider,
      costByGPU,
      costByMonth,
      projectedMonthlyCost,
      savingsRecommendations,
    };
  }

  private getGPUSpecs(gpuType: string): GPUInstance['specs'] {
    const specs: Record<string, GPUInstance['specs']> = {
      'MI300X': { vram: '192GB', computeUnits: '1536', systemMemory: '1TB', cpuCores: '128' },
      'MI325X': { vram: '192GB', computeUnits: '1536', systemMemory: '1TB', cpuCores: '128' },
      'MI250X': { vram: '128GB', computeUnits: '1024', systemMemory: '512GB', cpuCores: '64' },
      'MI250': { vram: '128GB', computeUnits: '1024', systemMemory: '512GB', cpuCores: '64' },
      'MI210': { vram: '96GB', computeUnits: '768', systemMemory: '256GB', cpuCores: '32' },
      'MI100': { vram: '32GB', computeUnits: '256', systemMemory: '128GB', cpuCores: '16' },
      'EPYC_7763': { vram: 'N/A', computeUnits: 'N/A', systemMemory: '1TB', cpuCores: '128' },
      'EPYC_7543': { vram: 'N/A', computeUnits: 'N/A', systemMemory: '512GB', cpuCores: '64' },
    };

    return specs[gpuType] || { vram: 'Unknown', computeUnits: 'Unknown', systemMemory: 'Unknown', cpuCores: 'Unknown' };
  }

  // Configuration
  updateConfig(updates: Partial<typeof this.config>): void {
    this.config = { ...this.config, ...updates };
  }

  getConfig(): typeof this.config {
    return { ...this.config };
  }

  // Health Checks
  async checkProviderHealth(providerId: string): Promise<boolean> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      return false;
    }

    try {
      // Simulate health check
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Math.random() > 0.1; // 90% success rate
    } catch (error) {
      return false;
    }
  }

  // Auto-cleanup
  startAutoCleanup(): void {
    setInterval(() => {
      if (this.config.autoStopIdleInstances) {
        const runningInstances = this.getInstances().filter(i => i.status === 'running');
        runningInstances.forEach(instance => {
          if (instance.lastStarted) {
            const idleTime = (Date.now() - instance.lastStarted.getTime()) / (1000 * 60); // minutes
            if (idleTime > this.config.idleTimeoutMinutes) {
              this.stopInstance(instance.id);
            }
          }
        });
      }
    }, 60000); // Check every minute
  }
}

// Export singleton instance
export const gpuCloudService = new GPUCloudService(); 