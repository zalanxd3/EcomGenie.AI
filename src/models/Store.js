const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Store {
  /**
   * Create a new store
   */
  static async create(storeData) {
    const { userId, storeType, storeName, apiKey } = storeData;
    const storeId = uuidv4();

    const query = `
      INSERT INTO stores (id, user_id, store_type, store_name, api_key, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [storeId, userId, storeType, storeName, apiKey]);
    return result.rows[0];
  }

  /**
   * Find stores by user ID
   */
  static async findByUserId(userId) {
    const query = 'SELECT * FROM stores WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Find store by ID
   */
  static async findById(storeId) {
    const query = 'SELECT * FROM stores WHERE id = $1';
    const result = await pool.query(query, [storeId]);
    return result.rows[0];
  }

  /**
   * Update store
   */
  static async update(storeId, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE stores SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
    
    const result = await pool.query(query, [...values, storeId]);
    return result.rows[0];
  }
}

module.exports = Store;
