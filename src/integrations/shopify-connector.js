const Shopify = require('shopify-api-node');
const pool = require('../config/database');

class ShopifyConnector {
  /**
   * Initialize Shopify connection
   */
  async initializeConnection(storeData) {
    try {
      const shopify = new Shopify({
        shopName: storeData.shopName,
        accessToken: storeData.accessToken
      });

      // Test connection
      await shopify.shop.get();
      return shopify;
    } catch (error) {
      throw new Error(`Shopify connection failed: ${error.message}`);
    }
  }

  /**
   * Fetch products from Shopify
   */
  async fetchProducts(shopify, limit = 100) {
    try {
      const products = await shopify.product.list({ limit });
      return products;
    } catch (error) {
      throw new Error(`Failed to fetch Shopify products: ${error.message}`);
    }
  }

  /**
   * Update product data
   */
  async updateProduct(shopify, productId, updateData) {
    try {
      const updated = await shopify.product.update(productId, updateData);
      return updated;
    } catch (error) {
      throw new Error(`Failed to update Shopify product: ${error.message}`);
    }
  }

  /**
   * Get abandoned checkouts
   */
  async getAbandonedCheckouts(shopify) {
    try {
      const checkouts = await shopify.checkout.list();
      return checkouts.filter(c => c.completed_at === null);
    } catch (error) {
      throw new Error(`Failed to fetch abandoned checkouts: ${error.message}`);
    }
  }

  /**
   * Create webhook for order events
   */
  async createWebhook(shopify, topic, callbackUrl) {
    try {
      const webhook = await shopify.webhook.create({
        topic: topic,
        address: callbackUrl,
        format: 'json'
      });
      return webhook;
    } catch (error) {
      throw new Error(`Failed to create Shopify webhook: ${error.message}`);
    }
  }
}

module.exports = new ShopifyConnector();
