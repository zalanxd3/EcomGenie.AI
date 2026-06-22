const openai = require('../config/openai');
const pool = require('../config/database');

class ProductOptimizationService {
  /**
   * Optimize product listing
   */
  async optimizeProductListing(productData) {
    try {
      const prompt = `Analyze and optimize the following e-commerce product listing:
        Current Title: ${productData.title}
        Current Description: ${productData.description}
        Category: ${productData.category}
        Price: ${productData.price}
        
        Provide optimization suggestions for:
        1. Title (SEO, clarity, keyword placement)
        2. Description (structure, benefits, keywords)
        3. Tags/Keywords (5-10 relevant keywords)
        4. Price positioning
        5. Overall conversion potential (score 1-10)
        
        Format as JSON with fields: optimized_title, optimization_suggestions, recommended_keywords, price_suggestion, conversion_score, reasoning`;

      const response = await openai.createChatCompletion({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.6,
        max_tokens: 600
      });

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      throw new Error(`Product optimization failed: ${error.message}`);
    }
  }

  /**
   * Bulk optimize products
   */
  async bulkOptimizeProducts(storeId, productIds) {
    try {
      const query = 'SELECT id, title, description, category, price FROM products WHERE id = ANY($1)';
      const result = await pool.query(query, [productIds]);
      
      const optimizations = [];
      for (const product of result.rows) {
        const optimized = await this.optimizeProductListing(product);
        optimizations.push({
          productId: product.id,
          ...optimized
        });
      }

      return optimizations;
    } catch (error) {
      throw new Error(`Bulk optimization failed: ${error.message}`);
    }
  }

  /**
   * Get keyword suggestions
   */
  async getKeywordSuggestions(productName, category) {
    try {
      const prompt = `Generate 15 high-value, long-tail keywords for:
        Product: ${productName}
        Category: ${category}
        
        For each keyword, provide:
        - The keyword phrase
        - Search volume potential (high/medium/low)
        - Competition level (high/medium/low)
        - Conversion potential (high/medium/low)
        
        Return as JSON array`;

      const response = await openai.createChatCompletion({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.5,
        max_tokens: 400
      });

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      throw new Error(`Keyword suggestion failed: ${error.message}`);
    }
  }
}

module.exports = new ProductOptimizationService();
