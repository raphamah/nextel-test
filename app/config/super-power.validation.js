const Joi = require('joi');

module.exports = {
  // POST /api/users
  paginate: {
    query: {
      page: Joi.number(),
      limit: Joi.number()
    }
  },
  create: {
    body: {
      name: Joi.string().required(),
      description: Joi.string(),
      superHero: Joi.string().required()
    }
  },
  update: {
    body: {
      name: Joi.string().required(),
      description: Joi.string()
    }
  },
};
