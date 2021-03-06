const mongoose = require("mongoose");
require("./superPower.model.js");
require("./protectionArea.model.js");
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const superHeroSchema = mongoose.Schema({
	_id: { type: ObjectId, auto: true },
	name: { type: String, index: { unique: true }},
	alias: { type: String, required: true },
	protectionArea: {type: ObjectId, ref: "protectionArea", index: true},
	superPowers: [
		{type: ObjectId, ref: "superPower"}
	]
});
superHeroSchema.statics = {
  
	paginate({ page = 1, limit = 50 } = {}) {
		return this.find()
			.skip(+((page-1)*50))
			.limit(+limit)
			.exec();
	}

};
module.exports = mongoose.model("superHero", superHeroSchema);