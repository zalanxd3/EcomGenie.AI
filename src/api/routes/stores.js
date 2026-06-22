const express = require('express');
const Store = require('../../models/Store');
const { authenticate } = require('../middleware/auth');
const { validateStore } = require('../middleware/validation');

const router = express.Router();

/**
 * POST /api/v1/stores
 * Create a new store connection
 */
router.post('/', authenticate, validateStore, async (req, res, next) => {
  try {
    const { storeType, storeName, credentials } = req.body;

    const store = await Store.create({
      userId: req.user.id,
      storeType,
      storeName,
      apiKey: credentials.apiKey
    });

    res.status(201).json({
      message: 'Store connected successfully',
      store
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/stores
 * Get all stores for user
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const stores = await Store.findByUserId(req.user.id);
    res.json({ stores });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/stores/:storeId
 * Get specific store details
 */
router.get('/:storeId', authenticate, async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.storeId);
    
    if (!store || store.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({ store });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
