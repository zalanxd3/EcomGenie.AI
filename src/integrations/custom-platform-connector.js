const axios = require('axios');
const pool = require('../config/database');

class CustomPlatformConnector {
  /**
   * Initialize connection to custom platform
   */
  async initializeConnection(storeData) {
    try {
      this.baseURL = storeData.apiUrl;
      this.apiKey = storeData.apiKey;
      this.client = axios.create({
        baseURL: this.baseURL,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      // Test connection
      await this.client.get('/health');
      return this.client;
    } catch (error) {
      throw new Error(`Custom platform connection failed: ${error.message}`);
    }
  }

  /**
   * Generic GET request
   */
  async get(endpoint) {
    try {
      const response = await this.client.get(endpoint);
      return response.data;
    } catch (error) {
      throw new Error(`GET request failed: ${error.message}`);
    }
  }

  /**
   * Generic POST request
   */
  async post(endpoint, data) {
    try {
      const response = await this.client.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw new Error(`POST request failed: ${error.message}`);
    }
  }

  /**
   * Generic PUT request
   */
  async put(endpoint, data) {
    try {
      const response = await this.client.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw new Error(`PUT request failed: ${error.message}`);
    }
  }

  /**
   * Fetch products
   */
  async fetchProducts() {
    return await this.get('/products');
  }

  /**
   * Update product
   */
  async updateProduct(productId, data) {
    return await this.put(`/products/${productId}`, data);
  }

  /**
   * Get abandoned carts
   */
  async getAbandonedCarts() {
    return await this.get('/carts/abandoned');
  }
}

module.exports = new CustomPlatformConnector();
