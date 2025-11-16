// Unified API exports
export { default as axiosInstance } from './base-api';
export { productService } from './services/productService';
export { authService } from './services/authService';

// Legacy exports for backward compatibility (will be deprecated)
export { fakeStoreAPI } from './server-api';
export { clientFakeStoreAPI } from './client-api';

