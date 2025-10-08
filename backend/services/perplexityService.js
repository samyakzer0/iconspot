import axios from 'axios';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_MODEL = 'sonar-pro';

export const enhancePrompt = async (userContext, style) => {
  try {
    const systemPrompt = `You are an expert prompt engineer specializing in creating detailed, accurate prompts for AI icon generation. Your task is to enhance user descriptions into comprehensive, well-structured prompts that will produce high-quality, professional icons.

Guidelines:
- Create prompts that specify exact visual details, colors, shapes, and compositions
- Include technical icon design principles (simplicity, scalability, recognizability)
- Consider the specified style (glass, neon, cyberpunk, minimal) and incorporate its characteristics
- Ensure prompts are detailed enough to generate 4 distinct variations
- Focus on creating prompts that work well for icon generation specifically
- Keep prompts concise but comprehensive (aim for 2-3 sentences)
- Use clear, descriptive language that AI image models can understand

Style characteristics:
- Glass: transparent, glossy, reflective, light effects, modern
- Neon: bright, glowing, luminous, vibrant colors, dark backgrounds
- Cyberpunk: futuristic, tech, circuits, neon accents, high contrast
- Minimal: simple, clean, geometric, monochromatic or limited palette`;

    const userPrompt = `Enhance this icon description into a detailed prompt for ${style} style icon generation:

User description: "${userContext}"

Please create a comprehensive prompt that includes:
1. Visual style specifications for ${style} aesthetic
2. Technical icon design requirements
3. Specific details that will help generate 4 distinct variations
4. Requirements for clean, professional results suitable for digital interfaces`;

    const response = await axios.post(PERPLEXITY_API_URL, {
      model: PERPLEXITY_MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error('No response from Perplexity API');
    }

    const enhancedPrompt = response.data.choices[0].message.content.trim();

    console.log('✅ Prompt enhanced successfully');
    console.log('Original:', userContext);
    console.log('Enhanced:', enhancedPrompt);

    return enhancedPrompt;

  } catch (error) {
    console.error('❌ Error enhancing prompt with Perplexity:', error.response?.data || error.message);
    throw new Error(`Failed to enhance prompt: ${error.response?.data?.error || error.message}`);
  }
};