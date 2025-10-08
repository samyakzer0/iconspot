import axios from 'axios';
import FormData from 'form-data';

const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg';

export const removeBackground = async (imageBase64) => {
  try {
    console.log('🖼️ Removing background from icon');

    // Check if this is SVG data (SVG base64 starts with 'PHN' which is '<' in base64)
    if (imageBase64.startsWith('PHN')) {
      console.log('🎨 SVG data detected, returning as-is (SVG supports transparency)');
      return imageBase64;
    }

    // Create form data for the API request
    const formData = new FormData();

    // Convert base64 to buffer and add to form data
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    formData.append('image_file', imageBuffer, {
      filename: 'icon.png',
      contentType: 'image/png'
    });

    // Add additional parameters for better results
    formData.append('size', 'auto');
    formData.append('format', 'png');
    formData.append('bg_color', ''); // Transparent background

    const response = await axios.post(REMOVE_BG_API_URL, formData, {
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY,
        ...formData.getHeaders()
      },
      timeout: 30000, // 30 seconds timeout
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    if (!response.data || !response.data.data) {
      throw new Error('Invalid response from remove.bg API');
    }

    // The API returns the processed image as base64 in response.data.data
    const processedImageBase64 = response.data.data;

    console.log('✅ Background removed successfully');
    return processedImageBase64;

  } catch (error) {
    console.error('❌ Error removing background:', error.response?.data || error.message);

    // For development/testing, return the original image
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Using original image for development (no background removal)');
      return imageBase64;
    }

    throw new Error(`Background removal failed: ${error.response?.data?.errors?.[0]?.title || error.message}`);
  }
};

// Alternative method for handling image URLs
export const removeBackgroundFromUrl = async (imageUrl) => {
  try {
    console.log('🖼️ Removing background from image URL');

    const formData = new FormData();
    formData.append('image_url', imageUrl);
    formData.append('size', 'auto');
    formData.append('format', 'png');
    formData.append('bg_color', '');

    const response = await axios.post(REMOVE_BG_API_URL, formData, {
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY,
        ...formData.getHeaders()
      },
      timeout: 30000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    if (!response.data || !response.data.data) {
      throw new Error('Invalid response from remove.bg API');
    }

    const processedImageBase64 = response.data.data;

    console.log('✅ Background removed successfully from URL');
    return processedImageBase64;

  } catch (error) {
    console.error('❌ Error removing background from URL:', error.response?.data || error.message);
    throw new Error(`Background removal from URL failed: ${error.response?.data?.errors?.[0]?.title || error.message}`);
  }
};