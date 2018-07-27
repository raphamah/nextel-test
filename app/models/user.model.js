const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AuditEvent = require('./superPower.model.js');
const Role = require('./role.model.js');

var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
var userSchema = mongoose.Schema({
	_id: { type: ObjectId, auto: true },
    username: { type: String, index: { unique: true }},
    password: { type: String, required: true },
    roles: [
    	{type: ObjectId, ref: 'role'}
    ]
});

userSchema.methods = {
	publish: function (entity,entityId,action,token,salt) {
		var decoded;
        try {
            decoded = jwt.verify(token, salt);
        } catch (e) {
            //return res.status(401).send('unauthorized');
        }
        PubSub.publish('channel', new AuditEvent({
            entity: entity,
            entityId: entityId,
            username: decoded.username,
            action: action,
        }));
	},
};
userSchema.statics = {
  
  paginate({ page = 1, limit = 50 } = {}) {
    return this.find()
      .skip(+((page-1)*50))
      .limit(+limit)
      .exec();
  }
  
};
userSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}
module.exports = mongoose.model('user', userSchema);