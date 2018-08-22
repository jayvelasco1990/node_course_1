const mongoose = require('mongoose')

const moment = require('moment')

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
	checkoutDate: { 
		type: Date,
		default: new Date()
	},
	returnDate: Date,
	rentalFee: Number
})

rentalSchema.statics.lookup = function (customerId, movieId) {
	return this.findOne({ customer: customerId, movie: movieId }).populate('movie')
}

rentalSchema.methods.return = function () {
	
	this.returnDate = Date.now()

	const rentalDays = moment().diff(this.checkoutDate, 'days')

	this.rentalFee =  rentalDays * this.movie.dailyRentalRate

	this.movie.numberInStock++
}

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
