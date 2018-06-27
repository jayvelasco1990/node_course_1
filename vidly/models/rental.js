const mongoose = require('mongoose')

const Joi = require('joi')

const rentalSchema = new mongoose.Schema({
	movie: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Movie'
	},
	genre: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Genre'
	} ,
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Customer'
	},
	checkoutDate: Date,
	returnDate: Date,
	rentalFee: Number
})

const Rental = mongoose.model('Rental', rentalSchema)

function validateRental(rental) {
	const schema = {
		movie: Joi.objectId(),
		genre: Joi.string(),
		customer: Joi.objectId(),
		checkoutDate: Joi.date(),
		returnDate: Joi.date(),
		rentalFee: Joi.number()
	}

	return Joi.validate(rental, schema)
}

exports.Rental = Rental

exports.validate = validateRental
