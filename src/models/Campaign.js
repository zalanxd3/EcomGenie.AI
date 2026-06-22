const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Campaign {
  /**
   * Create a new campaign
   */
  static async create(campaignData) {
    const { storeId, campaignName, campaignType, config } = campaignData;
    const campaignId = uuidv4();

    const query = `
      INSERT INTO campaigns (id, store_id, campaign_name, campaign_type, config, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [
      campaignId, 
      storeId, 
      campaignName, 
      campaignType, 
      JSON.stringify(config),
      'active'
    ]);
    return result.rows[0];
  }

  /**
   * Find campaigns by store ID
   */
  static async findByStoreId(storeId) {
    const query = 'SELECT * FROM campaigns WHERE store_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [storeId]);
    return result.rows;
  }

  /**
   * Get campaign metrics
   */
  static async getMetrics(campaignId) {
    const query = `
      SELECT 
        COUNT(*) as total_sent,
        SUM(CASE WHEN opened = true THEN 1 ELSE 0 END) as opened,
        SUM(CASE WHEN clicked = true THEN 1 ELSE 0 END) as clicked,
        SUM(CASE WHEN converted = true THEN 1 ELSE 0 END) as converted,
        SUM(revenue) as total_revenue
      FROM campaign_emails
      WHERE campaign_id = $1
    `;
    
    const result = await pool.query(query, [campaignId]);
    return result.rows[0];
  }
}

module.exports = Campaign;
