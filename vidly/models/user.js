const mongoose = require('mongoose')

const Joi = require('joi')

const userSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
		unique: true
	},
	password: String
})

const User = mongoose.model('User', userSchema)

function validateUser(user) {
	const schema = {
		name: Joi.string(),
		email: Joi.string(),
		password: Joi.string()
	}

	return Joi.validate(user, schema)
}

exports.User = User

exports.validate = validateUser
