const openai = require('../config/openai');

class ContentGenerationService {
  /**
   * Generate product description using AI
   */
  async generateProductDescription(productData) {
    try {
      const prompt = `Generate a compelling, SEO-optimized product description for:
        Product: ${productData.name}
        Category: ${productData.category}
        Features: ${productData.features.join(', ')}
        Price: ${productData.price}
        Target Audience: ${productData.targetAudience || 'General'}
        
        The description should be 100-150 words, engaging, and include relevant keywords.`;

      const response = await openai.createChatCompletion({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 300
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      throw new Error(`Content generation failed: ${error.message}`);
    }
  }

  /**
   * Generate optimized product title
   */
  async generateProductTitle(productData) {
    try {
      const prompt = `Generate 5 SEO-optimized product titles for:
        Product: ${productData.name}
        Category: ${productData.category}
        Key Features: ${productData.features.join(', ')}
        
        Titles should be concise (50-70 characters), include relevant keywords, and be engaging.`;

      const response = await openai.createChatCompletion({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 200
      });

      return response.data.choices[0].message.content.split('\n').filter(t => t.trim());
    } catch (error) {
      throw new Error(`Title generation failed: ${error.message}`);
    }
  }

  /**
   * Generate social media content
   */
  async generateSocialMediaContent(productData) {
    try {
      const prompt = `Generate engaging social media posts for:
        Product: ${productData.name}
        Description: ${productData.description}
        Price: ${productData.price}
        
        Create posts for:
        1. Instagram (max 150 chars with hashtags)
        2. Twitter/X (max 280 chars)
        3. Facebook (max 500 chars)
        
        Posts should be engaging, include CTAs, and drive conversions.`;

      const response = await openai.createChatCompletion({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.8,
        max_tokens: 400
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      throw new Error(`Social media content generation failed: ${error.message}`);
    }
  }
}

module.exports = new ContentGenerationService();
