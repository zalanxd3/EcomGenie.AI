const express = require('express');
const Campaign = require('../../models/Campaign');
const CartRecoveryService = require('../../services/cart-recovery');
const { authenticate } = require('../middleware/auth');
const { validateCampaign } = require('../middleware/validation');

const router = express.Router();

/**
 * POST /api/v1/campaigns
 * Create a new campaign
 */
router.post('/', authenticate, validateCampaign, async (req, res, next) => {
  try {
    const { storeId, campaignName, campaignType, config } = req.body;

    const campaign = await Campaign.create({
      storeId,
      campaignName,
      campaignType,
      config
    });

    res.status(201).json({
      message: 'Campaign created successfully',
      campaign
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/campaigns/:storeId
 * Get campaigns for a store
 */
router.get('/:storeId', authenticate, async (req, res, next) => {
  try {
    const campaigns = await Campaign.findByStoreId(req.params.storeId);
    res.json({ campaigns });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/campaigns/:campaignId/metrics
 * Get campaign metrics
 */
router.get('/:campaignId/metrics', authenticate, async (req, res, next) => {
  try {
    const metrics = await Campaign.getMetrics(req.params.campaignId);
    res.json({ metrics });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
