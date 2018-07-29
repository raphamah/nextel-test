const Joi = require("joi");

module.exports = {
	// POST /api/users
	paginate: {
		query: {
			page: Joi.number(),
			limit: Joi.number()
		}
	},
	help: {
		query: {
			latitude: Joi.number().required(),
			longitude: Joi.number().required()
		}
	},
	create: {
		body: {
			name: Joi.string().required(),
			alias: Joi.string().required(),
			protectionArea: {
				_id: Joi.string(),
				name: Joi.string(),
				loc: {
					coordinates: Joi.array()
				},
				radius: Joi.number(),
			},
			superPowers: Joi.array().items({
				_id: Joi.string()
			})
		}
	},
	update: {
		body: {
			name: Joi.string(),
			alias: Joi.string(),
			protectionArea: {
				_id: Joi.string(),
				name: Joi.string(),
				loc: {
					coordinates: Joi.array()
				},
				radius: Joi.number(),
			},
			superPowers: Joi.array().items({
				_id: Joi.string()
			})
		}
	},
};
