const mongoose = require("mongoose");

var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const roleSchema = mongoose.Schema({
	_id: { type: ObjectId, auto: true },
	name: { type: String, index: { unique: true }}
});

module.exports = mongoose.model("role", roleSchema);