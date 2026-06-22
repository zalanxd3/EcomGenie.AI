const Joi = require('joi');

const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateStore = (req, res, next) => {
  const schema = Joi.object({
    storeType: Joi.string().valid('shopify', 'woocommerce', 'custom').required(),
    storeName: Joi.string().required(),
    credentials: Joi.object().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateCampaign = (req, res, next) => {
  const schema = Joi.object({
    storeId: Joi.string().required(),
    campaignName: Joi.string().required(),
    campaignType: Joi.string().valid('abandoned-cart', 'product-promotion', 'email').required(),
    config: Joi.object().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateContent = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    features: Joi.array().items(Joi.string()),
    price: Joi.number(),
    description: Joi.string(),
    targetAudience: Joi.string()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateStore,
  validateCampaign,
  validateContent
};
