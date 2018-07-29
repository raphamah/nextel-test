const mongoose = require("mongoose");

var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const auditEventSchema = mongoose.Schema({
	_id: { type: ObjectId, auto: true },
	entity: { type: String, required: true },
	entityId: { type: String, required: true },
	datetime: { type: Date, default: Date.now },
	username: { type: String, required: true },
	action: { type: String, required: true },
});

module.exports = mongoose.model("auditEvent", auditEventSchema);