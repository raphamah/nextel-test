const Joi = require("joi");

module.exports = {
	// POST /api/users
	paginate: {
		query: {
			page: Joi.number(),
			limit: Joi.number()
		}
	},
	register: {
		body: {
			username: Joi.string().required(),
			password: Joi.string().required(),
			roles: Joi.array().required()
		}
	},
	signIn: {
		body: {
			username: Joi.string().required(),
			password: Joi.string().required()
		}
	},
	update: {
		body: {
			username: Joi.string(),
			password: Joi.string(),
			roles: Joi.array().required()
		}
	},
};
