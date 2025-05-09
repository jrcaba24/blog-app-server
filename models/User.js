const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Username is Required']
	},
	email: {
		type: String,
		required: [true, 'Email is Required']
	},
	password: {
		type: String,
		required: [true, 'Password is Required']
	},
	isAdmin: {
		type: Boolean,
		default: false
	}
})

// Model
module.exports = mongoose.model('User', userSchema);