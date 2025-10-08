import { GoogleGenAI } from "@google/genai";
import sharp from 'sharp';
import fs from 'node:fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });

// Debug: Check if API key is loaded
console.log('🔑 API Key Check:');
console.log('   Loaded:', !!process.env.GOOGLE_API_KEY);
console.log('   Length:', process.env.GOOGLE_API_KEY?.length || 0);
console.log('   Starts with AIza:', process.env.GOOGLE_API_KEY?.startsWith('AIza') || false);

// Validate API key exists
if (!process.env.GOOGLE_API_KEY) {
  console.error('❌ GOOGLE_API_KEY not found!');
  console.error('   Check that .env file exists at:', path.join(__dirname, '../.env'));
  console.error('   File should contain: GOOGLE_API_KEY=AIzaSyC...');
}

// Initialize Google GenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

// Cost tracking (MISSING IN YOUR CODE)
const costTracker = {
  totalImages: 0,
  totalCost: 0,
  COST_PER_IMAGE: 0.039, // $0.039 per image for Gemini 2.5 Flash Image
  resetDaily() {
    this.totalImages = 0;
    this.totalCost = 0;
  }
};

export const generateIconVariations = async (enhancedPrompt, style) => {
  try {
    console.log(`🎨 Generating icon variations with Gemini 2.5 Flash Image for style: ${style}`);

    const stylePrompts = {
       glass: `Single, focused glass-style icon with transparent, glossy, and reflective elements. Light effects, gradients, modern aesthetics. Clean composition with one central subject only. ${enhancedPrompt}`,
       neon: `Single, focused neon-style icon with bright, glowing, luminous effects. Vibrant colors, dark background, electric lighting. One central glowing element only. ${enhancedPrompt}`,
       cyberpunk: `Single, focused cyberpunk-style icon with futuristic, tech, circuit elements. Neon accents, high contrast, sci-fi aesthetics. One primary tech element only. ${enhancedPrompt}`,
       minimal: `Single, focused minimal-style icon with simple, clean, geometric design. Monochromatic or limited color palette, clean lines. One central geometric element only. ${enhancedPrompt}`
     };

    const basePrompt = stylePrompts[style.toLowerCase()] || enhancedPrompt;

    // Generate 4 variations sequentially
    const variations = [];
    const variationPrompts = [
      `${basePrompt} - Version 1: Standard interpretation, single focused element, professional icon design`,
      `${basePrompt} - Version 2: Alternative composition, single central subject, creative variation`,
      `${basePrompt} - Version 3: Different angle/perspective, one primary element, unique style`,
      `${basePrompt} - Version 4: Bold creative variation, single focused design, artistic interpretation`
    ];

    for (let i = 0; i < variationPrompts.length; i++) {
      try {
        console.log(`🎨 Generating variation ${i + 1}/4...`);
        const iconData = await generateSingleIcon(variationPrompts[i], style);
        variations.push(iconData);
        
        // Small delay to avoid rate limiting
        if (i < variationPrompts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`❌ Failed to generate variation ${i + 1}:`, error.message);
        
        // Use SVG fallback for failed generation
        const fallbackData = await generateSVGFallback(variationPrompts[i], style, false);
        variations.push(fallbackData);
      }
    }

    // Track total cost
    const successfulGenerations = variations.filter(v => !v.startsWith('data:image/svg')).length;
    const cost = successfulGenerations * costTracker.COST_PER_IMAGE;
    costTracker.totalImages += successfulGenerations;
    costTracker.totalCost += cost;

    console.log(`✅ Generated ${variations.length} icon variations`);
    console.log(`💰 Cost: $${cost.toFixed(3)} | Total today: $${costTracker.totalCost.toFixed(2)}`);

    return variations;

  } catch (error) {
    console.error('❌ Error generating icon variations:', error);
    throw new Error(`Failed to generate icon variations: ${error.message}`);
  }
};

export const generateHighQualityIcon = async (enhancedPrompt, style) => {
  try {
    console.log(`🎯 Generating high-quality icon with Gemini 2.5 Flash Image for style: ${style}`);

    const stylePrompts = {
       glass: `Single, focused high-quality glass-style icon, transparent and glossy with professional lighting effects. One central subject with clean composition. ${enhancedPrompt}`,
       neon: `Single, focused high-quality neon-style icon, bright and glowing with professional luminous effects. One central glowing element only. ${enhancedPrompt}`,
       cyberpunk: `Single, focused high-quality cyberpunk-style icon, futuristic with professional tech details. One primary tech element only. ${enhancedPrompt}`,
       minimal: `Single, focused high-quality minimal-style icon, clean and simple with professional geometric design. One central geometric element only. ${enhancedPrompt}`
     };

    const hqPrompt = stylePrompts[style.toLowerCase()] || enhancedPrompt;
    const iconData = await generateSingleIcon(hqPrompt, style, true);

    // Track cost
    costTracker.totalImages += 1;
    costTracker.totalCost += costTracker.COST_PER_IMAGE;

    console.log(`✅ Generated high-quality icon`);
    console.log(`💰 Cost: $${costTracker.COST_PER_IMAGE.toFixed(3)}`);

    return iconData;

  } catch (error) {
    console.error('❌ Error generating high-quality icon:', error);
    throw new Error(`Failed to generate high-quality icon: ${error.message}`);
  }
};

const generateSingleIcon = async (prompt, style, highQuality = false) => {
  try {
    console.log(`🎨 Generating ${highQuality ? 'HQ' : 'standard'} icon with Gemini 2.5 Flash Image`);

    // Validate API key
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY environment variable is not set');
    }

    const size = highQuality ? '1024x1024' : '512x512';
     const finalPrompt = `Professional ${size} ${style} style icon: ${prompt}. Single, focused icon with one central element only. Clean, scalable design optimized for digital interfaces. High quality, modern aesthetic. No additional elements or multiple subjects.`;

    // Generate content with Gemini 2.0 Flash Image Generation
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: finalPrompt,  // Pass prompt directly as string
      config: {
        responseModalities: ["TEXT", "IMAGE"]  // Required for image generation
      }
    });
    
    // Check if response has candidates
     if (!response.candidates || response.candidates.length === 0) {
       throw new Error('No candidates in Gemini response');
     }

     const candidate = response.candidates[0];

     // Check if response has parts
     if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
       throw new Error('No parts in Gemini response');
     }

     // Extract image from response parts
     for (const part of candidate.content.parts) {
       if (part.inlineData && part.inlineData.data) {
         const imageData = part.inlineData.data;
         console.log('✅ Generated image with Gemini 2.0 Flash');
         console.log('📊 Image data type:', typeof imageData);
         console.log('📊 Image data length:', imageData?.length || 0);

         // Return base64 image data
         return imageData;
       } else if (part.text) {
         console.log('📝 Model response text:', part.text);
       }
     }

     // Debug: Log response structure if no image found
     console.log('🔍 Response structure:', JSON.stringify(response, null, 2));

     // If no image found, throw error to trigger fallback
     throw new Error('No image data in Gemini response');

  } catch (error) {
    // Handle specific error types
    if (error.message?.includes('API key')) {
      console.error('❌ Invalid or missing API key');
    } else if (error.message?.includes('quota')) {
      console.error('❌ API quota exceeded');
    } else if (error.message?.includes('429')) {
      console.error('❌ Rate limit exceeded');
    }

    console.error('❌ Gemini API error:', error.message);
    console.log('🔄 Falling back to SVG generation...');
    
    // Use SVG fallback
    return await generateSVGFallback(prompt, style, highQuality);
  }
};

// Fallback: Generate SVG and convert to PNG using Sharp
const generateSVGFallback = async (prompt, style, highQuality) => {
  try {
    console.log(`🎨 Generating SVG fallback icon for style: ${style}`);

    // Generate SVG based on style and prompt
    const svgData = generateSVGIcon(prompt, style, highQuality);

    // Convert SVG to PNG using Sharp
    const pngBuffer = await sharp(Buffer.from(svgData))
      .png()
      .resize(highQuality ? 1024 : 512, highQuality ? 1024 : 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toBuffer();

    // Return as base64
    return pngBuffer.toString('base64');

  } catch (error) {
    console.error('❌ Fallback generation failed:', error.message);

    // Final fallback: simple placeholder
    try {
      const simpleSVG = generateSimplePlaceholder(style);
      const pngBuffer = await sharp(Buffer.from(simpleSVG))
        .png()
        .toBuffer();
      
      return pngBuffer.toString('base64');
    } catch (finalError) {
      console.error('❌ Even placeholder generation failed:', finalError.message);
      // Return inline SVG data URI as last resort
      const svg = generateSimplePlaceholder(style);
      return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    }
  }
};

// Generate SVG icon based on style and prompt
const generateSVGIcon = (prompt, style, highQuality) => {
  const size = highQuality ? 1024 : 512;
  const iconSize = highQuality ? 800 : 400;

  const styleColors = {
    glass: { primary: '#87CEEB', secondary: '#E0F6FF', accent: '#FFFFFF' },
    neon: { primary: '#FF00FF', secondary: '#00FFFF', accent: '#FFFF00' },
    cyberpunk: { primary: '#FF00AA', secondary: '#00FFFF', accent: '#AAFF00' },
    minimal: { primary: '#333333', secondary: '#666666', accent: '#999999' }
  };

  const colors = styleColors[style.toLowerCase()] || styleColors.minimal;

  // Determine icon type from prompt
  let iconSVG = '';
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('coffee') || lowerPrompt.includes('mug')) {
    iconSVG = generateCoffeeMugSVG(colors, iconSize);
  } else if (lowerPrompt.includes('shopping') || lowerPrompt.includes('bag') || lowerPrompt.includes('cart')) {
    iconSVG = generateShoppingBagSVG(colors, iconSize);
  } else if (lowerPrompt.includes('star') || lowerPrompt.includes('favorite')) {
    iconSVG = generateStarSVG(colors, iconSize);
  } else if (lowerPrompt.includes('arrow') || lowerPrompt.includes('pointer')) {
    iconSVG = generateArrowSVG(colors, iconSize);
  } else {
    iconSVG = generateDefaultSVG(colors, iconSize);
  }

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="${colors.secondary}"/>
    <rect x="${(size - iconSize) / 2}" y="${(size - iconSize) / 2}"
          width="${iconSize}" height="${iconSize}"
          fill="${colors.primary}" rx="20"/>
    ${generateStyleEffects(style, colors, iconSize, size)}
    <g transform="translate(${(size - iconSize) / 2}, ${(size - iconSize) / 2})">
      ${iconSVG}
    </g>
  </svg>`;
};

// SVG generators
const generateCoffeeMugSVG = (colors, size) => {
  const scale = size / 400;
  return `
    <ellipse cx="200" cy="300" rx="${150 * scale}" ry="${100 * scale}" fill="${colors.accent}" opacity="0.8"/>
    <ellipse cx="200" cy="280" rx="${140 * scale}" ry="${90 * scale}" fill="${colors.primary}"/>
    <path d="M ${350 * scale} 250 Q ${420 * scale} 250 ${420 * scale} 300 Q ${420 * scale} 350 ${350 * scale} 350"
          stroke="${colors.accent}" stroke-width="${20 * scale}" fill="none" opacity="0.6"/>
    <ellipse cx="200" cy="260" rx="${130 * scale}" ry="${20 * scale}" fill="#8B4513" opacity="0.7"/>
  `;
};

const generateShoppingBagSVG = (colors, size) => {
  const scale = size / 400;
  return `
    <path d="M ${100 * scale} ${150 * scale} Q ${100 * scale} ${100 * scale} ${150 * scale} ${100 * scale}
             L ${250 * scale} ${100 * scale} Q ${300 * scale} ${100 * scale} ${300 * scale} ${150 * scale}
             L ${300 * scale} ${350 * scale} Q ${300 * scale} ${380 * scale} ${250 * scale} ${380 * scale}
             L ${150 * scale} ${380 * scale} Q ${100 * scale} ${380 * scale} ${100 * scale} ${350 * scale} Z"
          fill="${colors.primary}"/>
    <ellipse cx="${150 * scale}" cy="${120 * scale}" rx="${30 * scale}" ry="${8 * scale}"
             fill="${colors.accent}" opacity="0.8"/>
    <ellipse cx="${250 * scale}" cy="${120 * scale}" rx="${30 * scale}" ry="${8 * scale}"
             fill="${colors.accent}" opacity="0.8"/>
  `;
};

const generateStarSVG = (colors, size) => {
  const scale = size / 400;
  return `
    <path d="M200 ${50 * scale} L240 ${150 * scale} L350 ${150 * scale} L230 ${220 * scale}
             L270 ${320 * scale} L200 ${250 * scale} L130 ${320 * scale} L170 ${220 * scale}
             L50 ${150 * scale} L160 ${150 * scale} Z"
          fill="${colors.primary}" stroke="${colors.accent}" stroke-width="${5 * scale}"/>
  `;
};

const generateArrowSVG = (colors, size) => {
  const scale = size / 400;
  return `
    <path d="M ${100 * scale} ${200 * scale} L ${280 * scale} ${200 * scale} L ${280 * scale} ${150 * scale} 
             L ${360 * scale} ${225 * scale} L ${280 * scale} ${300 * scale} L ${280 * scale} ${250 * scale} 
             L ${100 * scale} ${250 * scale} Z"
          fill="${colors.primary}" stroke="${colors.accent}" stroke-width="${3 * scale}"/>
  `;
};

const generateDefaultSVG = (colors, size) => {
  const scale = size / 400;
  return `
    <rect x="${150 * scale}" y="${150 * scale}" width="${100 * scale}" height="${100 * scale}"
          fill="${colors.accent}" opacity="0.8" rx="${10 * scale}"/>
    <circle cx="${180 * scale}" cy="${180 * scale}" r="${30 * scale}" fill="${colors.primary}"/>
  `;
};

const generateStyleEffects = (style, colors, iconSize, containerSize) => {
  const scale = iconSize / 400;
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;

  switch (style.toLowerCase()) {
    case 'glass':
      return `<ellipse cx="${centerX}" cy="${centerY}" rx="${iconSize * 0.3}" ry="${iconSize * 0.1}"
                 fill="${colors.accent}" opacity="0.2"/>`;
    case 'neon':
      return `<ellipse cx="${centerX}" cy="${centerY}" rx="${iconSize * 0.35}" ry="${iconSize * 0.35}"
                 fill="none" stroke="${colors.primary}" stroke-width="${8 * scale}" opacity="0.6"/>`;
    case 'cyberpunk':
      return `<circle cx="${centerX - iconSize * 0.3}" cy="${centerY - iconSize * 0.3}" r="${5 * scale}" fill="${colors.primary}"/>
              <circle cx="${centerX + iconSize * 0.3}" cy="${centerY + iconSize * 0.3}" r="${5 * scale}" fill="${colors.primary}"/>`;
    default:
      return `<rect x="${centerX - iconSize * 0.45}" y="${centerY - iconSize * 0.45}" width="${iconSize * 0.9}" height="${iconSize * 0.9}"
              fill="none" stroke="${colors.accent}" stroke-width="${3 * scale}" opacity="0.2"/>`;
  }
};

const generateSimplePlaceholder = (style) => {
  return `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#F0F0F0"/>
    <text x="256" y="256" font-family="Arial" font-size="24" font-weight="bold" 
          fill="#CCCCCC" text-anchor="middle">${style.toUpperCase()}</text>
  </svg>`;
};

// Export cost tracking
export const getCostStats = () => ({
  totalImages: costTracker.totalImages,
  totalCost: costTracker.totalCost,
  costPerImage: costTracker.COST_PER_IMAGE
});

export const resetCostStats = () => costTracker.resetDaily();

