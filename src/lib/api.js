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
    const response = await fetch(url, finalOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export default API_BASE_URL;