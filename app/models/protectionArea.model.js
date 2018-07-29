const mongoose = require("mongoose");

var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const protectionAreaSchema = mongoose.Schema({
	_id: { type: ObjectId, auto: true },
	name: { type: String, index: { unique: true }},
	loc: {
		type: { type: String, default:"Point" },
		coordinates: [Number],
	},
	radius: { type: Number, required: true },
});
protectionAreaSchema.index({ "loc": "2dsphere" });

module.exports = mongoose.model("protectionArea", protectionAreaSchema);