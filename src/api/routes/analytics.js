const express = require('express');
const pool = require('../../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/v1/analytics/dashboard/:storeId
 * Get dashboard analytics
 */
router.get('/dashboard/:storeId', authenticate, async (req, res, next) => {
  try {
    const query = `
      SELECT 
        COUNT(DISTINCT c.id) as total_campaigns,
        SUM(CASE WHEN c.status = 'active' THEN 1 ELSE 0 END) as active_campaigns,
        SUM(ce.revenue) as total_revenue,
        AVG(CASE WHEN ce.opened = true THEN 1 ELSE 0 END) * 100 as avg_open_rate,
        AVG(CASE WHEN ce.clicked = true THEN 1 ELSE 0 END) * 100 as avg_click_rate
      FROM campaigns c
      LEFT JOIN campaign_emails ce ON c.id = ce.campaign_id
      WHERE c.store_id = $1
    `;

    const result = await pool.query(query, [req.params.storeId]);
    res.json({ analytics: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/analytics/cart-recovery/:storeId
 * Get cart recovery metrics
 */
router.get('/cart-recovery/:storeId', authenticate, async (req, res, next) => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_abandoned,
        SUM(CASE WHEN recovered = true THEN 1 ELSE 0 END) as recovered_count,
        ROUND(SUM(CASE WHEN recovered = true THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100, 2) as recovery_rate,
        SUM(total) as total_potential_revenue
      FROM abandoned_carts
      WHERE store_id = $1 AND created_at > NOW() - INTERVAL '30 days'
    `;

    const result = await pool.query(query, [req.params.storeId]);
    res.json({ metrics: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
