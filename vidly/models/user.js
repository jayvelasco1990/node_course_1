const mongoose = require('mongoose')

const Joi = require('joi')

const jwt = require('jsonwebtoken')

const config = require('config')

const userSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
		unique: true
	},
	password: String
})

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'))
	return token
}

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
