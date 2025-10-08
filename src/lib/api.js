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
    console.log('📋 Request options:', finalOptions);

    const response = await fetch(url, finalOptions);

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Response:', data);
    return data;
  } catch (error) {
    console.error('💥 API call failed:', error);

    // If it's a network error, provide more specific error message
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Network error: Unable to connect to server. Please check if the server is running.');
    }

    throw error;
  }
};

export default API_BASE_URL;