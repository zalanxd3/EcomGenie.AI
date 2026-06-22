const express = require('express');
const ContentGenerationService = require('../../services/content-generation');
const ProductOptimizationService = require('../../services/product-optimization');
const { authenticate } = require('../middleware/auth');
const { validateContent } = require('../middleware/validation');

const router = express.Router();

/**
 * POST /api/v1/content/generate-description
 * Generate product description
 */
router.post('/generate-description', authenticate, validateContent, async (req, res, next) => {
  try {
    const description = await ContentGenerationService.generateProductDescription(req.body);
    res.json({ description });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/content/generate-title
 * Generate product titles
 */
router.post('/generate-title', authenticate, validateContent, async (req, res, next) => {
  try {
    const titles = await ContentGenerationService.generateProductTitle(req.body);
    res.json({ titles });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/content/generate-social
 * Generate social media content
 */
router.post('/generate-social', authenticate, validateContent, async (req, res, next) => {
  try {
    const content = await ContentGenerationService.generateSocialMediaContent(req.body);
    res.json({ content });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/content/optimize-listing
 * Optimize product listing
 */
router.post('/optimize-listing', authenticate, validateContent, async (req, res, next) => {
  try {
    const optimization = await ProductOptimizationService.optimizeProductListing(req.body);
    res.json({ optimization });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
