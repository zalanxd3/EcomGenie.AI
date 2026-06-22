const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const pool = require('../config/database');

class WooCommerceConnector {
  /**
   * Initialize WooCommerce connection
   */
  initializeConnection(storeData) {
    try {
      const woocommerce = new WooCommerceRestApi({
        url: storeData.storeUrl,
        consumerKey: storeData.consumerKey,
        consumerSecret: storeData.consumerSecret,
        version: 'wc/v3'
      });

      return woocommerce;
    } catch (error) {
      throw new Error(`WooCommerce connection failed: ${error.message}`);
    }
  }

  /**
   * Fetch products from WooCommerce
   */
  async fetchProducts(woocommerce, perPage = 100) {
    try {
      const response = await woocommerce.get('products', { per_page: perPage });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch WooCommerce products: ${error.message}`);
    }
  }

  /**
   * Update product
   */
  async updateProduct(woocommerce, productId, updateData) {
    try {
      const response = await woocommerce.put(`products/${productId}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update WooCommerce product: ${error.message}`);
    }
  }

  /**
   * Get orders (for abandoned cart detection)
   */
  async getOrders(woocommerce, status = 'pending') {
    try {
      const response = await woocommerce.get('orders', { status });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch WooCommerce orders: ${error.message}`);
    }
  }

  /**
   * Create webhook
   */
  async createWebhook(woocommerce, event, deliveryUrl) {
    try {
      const response = await woocommerce.post('webhooks', {
        name: `Webhook - ${event}`,
        topic: event,
        delivery_url: deliveryUrl,
        active: true
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create WooCommerce webhook: ${error.message}`);
    }
  }
}

module.exports = new WooCommerceConnector();
