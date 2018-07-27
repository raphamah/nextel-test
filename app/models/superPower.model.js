const mongoose = require('mongoose');
const SuperHero = require('./superHero.model.js');
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const superPowerSchema = mongoose.Schema({
	_id: { type: ObjectId, auto: true },
    name: { type: String, index: { unique: true }},
    description: String,
    superHero: {type: ObjectId, ref: 'superHero'},
});
superPowerSchema.statics = {
  
  paginate({ page = 1, limit = 50 } = {}) {
    return this.find()
      .skip(+((page-1)*50))
      .limit(+limit)
      .exec();
  }
  
};
module.exports = mongoose.model('superPower', superPowerSchema);