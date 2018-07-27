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
      alias: Joi.string().required(),
      protectionArea: {
        name: Joi.string().required(),
        loc: Joi.array().required(),
        radius: Joi.number().required(),
      }
    }
  },
  update: {
    body: {
      name: Joi.string(),
      alias: Joi.string(),
      protectionArea: {
        name: Joi.string(),
        lat: Joi.number(),
        long: Joi.number(),
        radius: Joi.number(),
      },
    }
  },
};
