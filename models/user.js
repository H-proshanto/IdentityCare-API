const ImageModel = require('./image');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

userSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	bio: String,
	username: String,
	password: String,
	passwordConf: String,
	profileImage: Buffer,
}),
User = mongoose.model('User', userSchema);

module.exports = User;