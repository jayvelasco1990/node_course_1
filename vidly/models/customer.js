const mongoose = require('mongoose')

const Joi = require('joi')

const customersSchema = new mongoose.Schema({
	isGold: { 
		type: Boolean,
		default: false
	},
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50
	},
	phone: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50
	}
})

const Customer = mongoose.model('Customer', customersSchema)

function validateCustomer(customer) {
	const schema = {
		name: Joi.string().min(5).max(50).required(),
		phone: Joi.string().min(5).max(50).required(),
		isGold: Joi.boolean()
	}

	return Joi.validate(customer, schema)
}

exports.Customer = Customer

exports.validate = validateCustomer