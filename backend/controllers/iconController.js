import { enhancePrompt } from '../services/perplexityService.js';
import { generateIconVariations, generateHighQualityIcon as generateHQIcon } from '../services/nanoBananaService.js';
import { removeBackground } from '../services/removeBgService.js';
import fs from 'fs/promises';
import path from 'path';

// In-memory storage for generated icons (in production, use a database)
const generatedIcons = new Map();

export const generateIcons = async (req, res) => {
  try {
    const { style, context } = req.body;

    if (!style || !context) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Style and context are required'
      });
    }

    console.log(`🎨 Generating icons for style: ${style}, context: ${context}`);

    // Step 1: Enhance the prompt using Perplexity Pro
    const enhancedPrompt = await enhancePrompt(context, style);

    // Step 2: Generate 4 icon variations using nano banana
    const iconVariations = await generateIconVariations(enhancedPrompt, style);

    // Step 3: Store the variations temporarily
    const iconId = `icon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const iconData = {
      id: iconId,
      style,
      context,
      enhancedPrompt,
      variations: iconVariations.map((icon, index) => ({
        id: `${iconId}_var_${index}`,
        data: icon,
        url: `data:image/png;base64,${icon}`
      })),
      createdAt: new Date().toISOString()
    };

    generatedIcons.set(iconId, iconData);

    console.log(`✅ Generated ${iconVariations.length} icon variations for ${iconId}`);

    res.json({
      success: true,
      iconId,
      variations: iconData.variations,
      enhancedPrompt
    });

  } catch (error) {
    console.error('❌ Error generating icons:', error);
    res.status(500).json({
      error: 'Failed to generate icons',
      message: error.message
    });
  }
};

export const generateHighQualityIcon = async (req, res) => {
   try {
     const { iconId, selectedVariationIndex, skipGeneration = true } = req.body;

     if (!iconId || selectedVariationIndex === undefined) {
       return res.status(400).json({
         error: 'Missing required fields',
         message: 'Icon ID and selected variation index are required'
       });
     }

     const iconData = generatedIcons.get(iconId);
     if (!iconData) {
       return res.status(404).json({
         error: 'Icon not found',
         message: 'The requested icon session has expired'
       });
     }

     const selectedVariation = iconData.variations[selectedVariationIndex];
     if (!selectedVariation) {
       return res.status(404).json({
         error: 'Variation not found',
         message: 'The selected icon variation was not found'
       });
     }

     console.log(`🎯 Processing icon for ${iconId}, variation ${selectedVariationIndex}`);

     let finalIconData;

     if (skipGeneration) {
       // Skip generation and use selected variation directly
       console.log(`⏭️ Skipping high-quality generation, using selected variation directly`);

       // For SVG icons, use as-is (they have transparent backgrounds)
       // For PNG icons, remove background using remove.bg
       if (selectedVariation.data.startsWith('PHN')) { // SVG data starts with 'PHN' (base64 of '<')
         console.log('🎨 SVG icon detected, using as-is');
         finalIconData = selectedVariation.data;
       } else {
         console.log('🖼️ PNG icon detected, removing background');
         finalIconData = await removeBackground(selectedVariation.data);
       }
     } else {
       // Generate high-quality version (existing workflow)
       console.log(`🎯 Generating high-quality version`);

       // Step 1: Generate high-quality version using nano banana
       const highQualityIcon = await generateHQIcon(iconData.enhancedPrompt, iconData.style);

       // Step 2: For SVG icons, skip background removal (they have transparent backgrounds)
       // For PNG icons, remove background using remove.bg
       if (highQualityIcon.startsWith('PHN')) { // SVG data starts with 'PHN' (base64 of '<')
         console.log('🎨 SVG icon detected, skipping background removal');
         finalIconData = highQualityIcon;
       } else {
         console.log('🖼️ PNG icon detected, removing background');
         finalIconData = await removeBackground(highQualityIcon);
       }
     }

     // Step 3: Update the stored icon data
     iconData.finalIcon = {
       data: finalIconData,
       url: `data:image/png;base64,${finalIconData}`,
       processedAt: new Date().toISOString(),
       skippedGeneration: skipGeneration
     };

     generatedIcons.set(iconId, iconData);

     console.log(`✅ Processed icon for ${iconId} ${skipGeneration ? '(skipped generation)' : '(high-quality generated)'}`);

     res.json({
       success: true,
       finalIcon: iconData.finalIcon,
       skippedGeneration: skipGeneration
     });

   } catch (error) {
     console.error('❌ Error processing icon:', error);
     res.status(500).json({
       error: 'Failed to process icon',
       message: error.message
     });
   }
};

export const downloadIcon = async (req, res) => {
  try {
    const { iconId } = req.params;

    const iconData = generatedIcons.get(iconId);
    if (!iconData || !iconData.finalIcon) {
      return res.status(404).json({
        error: 'Icon not found',
        message: 'The requested icon was not found or not yet processed'
      });
    }

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="iconspot_${iconId}.${iconData.style}.png"`);
    res.setHeader('Content-Type', 'image/png');

    // Convert base64 to buffer and send
    const iconBuffer = Buffer.from(iconData.finalIcon.data, 'base64');
    res.send(iconBuffer);

    console.log(`📥 Icon downloaded: ${iconId}`);

  } catch (error) {
    console.error('❌ Error downloading icon:', error);
    res.status(500).json({
      error: 'Failed to download icon',
      message: error.message
    });
  }
};