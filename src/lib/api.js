// API configuration for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://iconspot-2.onrender.com';

export const API_ENDPOINTS = {
  GENERATE_ICONS: `${API_BASE_URL}/api/icons/generate`,
  GENERATE_HIGH_QUALITY: `${API_BASE_URL}/api/icons/generate-high-quality`,
  DOWNLOAD_ICON: (iconId) => `${API_BASE_URL}/api/icons/download/${iconId}`,
  HEALTH: `${API_BASE_URL}/health`
};

export const apiCall = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    console.log('🚀 Making API call to:', url);
    console.log('📋 Request method:', finalOptions.method || 'GET');

    // Test basic connectivity first
    try {
      console.log('🔍 Testing server connectivity...');
      const testResponse = await fetch(url.replace('/api/', '/health'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('🏥 Health check status:', testResponse.status);
    } catch (testError) {
      console.error('❌ Health check failed:', testError.message);
      throw new Error(`Server not accessible: ${testError.message}`);
    }

    console.log('📡 Making actual API request...');
    const response = await fetch(url, finalOptions);

    console.log('📡 Response status:', response.status);
    console.log('📡 Response type:', response.type);
    console.log('📡 Response url:', response.url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Response received');
    return data;
  } catch (error) {
    console.error('💥 API call failed:', error);

    // Provide more specific error messages
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Network error: Cannot connect to ${url}. The server might be sleeping or unreachable.`);
    }

    if (error.message.includes('CORS')) {
      throw new Error(`CORS error: Cross-origin request blocked. Check server CORS configuration.`);
    }

    if (error.message.includes('Server not accessible')) {
      throw error; // Re-throw connectivity errors as-is
    }

    throw error;
  }
};

// Test function to verify connectivity
export const testConnectivity = async () => {
  console.log('🔍 Testing connectivity to:', API_BASE_URL);

  try {
    // Test 1: Basic connectivity
    console.log('1️⃣ Testing basic connectivity...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    console.log('   Health check status:', healthResponse.status);

    if (!healthResponse.ok) {
      throw new Error(`Health check failed: ${healthResponse.status}`);
    }

    const healthData = await healthResponse.json();
    console.log('   Health data:', healthData);

    // Test 2: Debug endpoint
    console.log('2️⃣ Testing debug endpoint...');
    const debugResponse = await fetch(`${API_BASE_URL}/debug`);
    console.log('   Debug check status:', debugResponse.status);

    if (!debugResponse.ok) {
      throw new Error(`Debug check failed: ${debugResponse.status}`);
    }

    const debugData = await debugResponse.json();
    console.log('   Debug data:', debugData);

    // Test 3: CORS preflight
    console.log('3️⃣ Testing CORS preflight...');
    const corsResponse = await fetch(`${API_BASE_URL}/api/icons/generate`, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://iconspot.vercel.app'
      }
    });
    console.log('   CORS preflight status:', corsResponse.status);

    console.log('✅ All connectivity tests passed!');
    return {
      health: healthData,
      debug: debugData,
      cors: corsResponse.status
    };

  } catch (error) {
    console.error('❌ Connectivity test failed:', error);
    throw error;
  }
};

export default API_BASE_URL;