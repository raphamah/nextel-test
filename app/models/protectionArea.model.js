const mongoose = require('mongoose');

var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const protectionAreaSchema = mongoose.Schema({
	_id: { type: ObjectId, auto: true },
    name: { type: String, index: { unique: true }},
    loc: {
		type: [Number],  // [<longitude>, <latitude>]
		index: '2d'      // create the geospatial index
	},
    radius: { type: Number, required: true },
});

module.exports = mongoose.model('protectionArea', protectionAreaSchema);