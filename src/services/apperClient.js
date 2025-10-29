/**
 * Singleton class to manage ApperClient instance
 * Prevents multiple SDK initializations
 */
class ApperClientSingleton {
  constructor() {
    this._client = null;
    this._isInitializing = false;
  }

  getInstance() {
    // Return cached instance if exists
// Return cached instance if exists and SDK is available
    if (this._client && window.ApperSDK) {
      return this._client;
    }

    // SDK not loaded yet
    if (!window.ApperSDK) {
      console.warn('ApperSDK not available on window object');
      return null;
    }

    // Prevent simultaneous initialization
    if (this._isInitializing) {
      return null;
    }

    try {
      this._isInitializing = true;
      
// Verify SDK is fully loaded before accessing ApperClient
      if (!window.ApperSDK || !window.ApperSDK.ApperClient) {
        console.warn('ApperSDK not fully loaded yet');
        return null;
      }

      const { ApperClient } = window.ApperSDK;
      const projectId = import.meta.env.VITE_APPER_PROJECT_ID;
      const publicKey = import.meta.env.VITE_APPER_PUBLIC_KEY;

      if (!projectId) {
        console.error('VITE_APPER_PROJECT_ID is required');
        return null;
      }

// Create client only after SDK verification passes
      this._client = new ApperClient({
        apperProjectId: projectId,
        apperPublicKey: publicKey,
      });

      console.info('ApperClient initialized successfully');
      return this._client;
    } catch (error) {
      console.error('Failed to initialize ApperClient:', error);
      return null;
    } finally {
      this._isInitializing = false;
    }
  }

  reset() {
    if (this._client) {
      this._client = null;
    }
  }
}

// Create singleton instance
let _singletonInstance = null;

const getSingleton = () => {
  if (!_singletonInstance) {
    _singletonInstance = new ApperClientSingleton();
  }
  return _singletonInstance;
};

// Main export - returns null if SDK not ready, allowing services to retry
export const getApperClient = () => getSingleton().getInstance();

// Alternative exports
// Alternative exports for flexibility
export const apperClientSingleton = {
  getInstance: () => getSingleton().getInstance(),
  reset: () => getSingleton().reset(),
};

export default getSingleton;