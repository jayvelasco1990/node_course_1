const Joi = require('joi')

const moment = require('moment')

const express = require('express')

const auth = require('../middleware/auth')

const { Rental } = require('../models/rental')

const router = express.Router()

const validate = require('../middleware/validate')

router.post('/', [auth, validate(validateReturn)], async (req, res) => {

	const rental = await Rental.findOne({ customer: req.body.customerId, movie: req.body.movieId }).populate('movie')

	if (!rental) return res.status(404).send('No rental found for this customer/movie')

	if (rental.returnDate) return res.status(400).send('Rental already processed')

	rental.returnDate = Date.now()
	
	const rentalDays = moment().diff(rental.checkoutDate, 'days')

	rental.rentalFee =  rentalDays * rental.movie.dailyRentalRate

	await rental.save()

	rental.movie.numberInStock++

	await rental.movie.save()

	return res.status(200).send(rental)

})

function validateReturn(req) {
	const schema = {
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required()
	}

	return Joi.validate(req, schema)
}

module.exports = router