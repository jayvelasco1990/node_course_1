const moment = require('moment')

const express = require('express')

const auth = require('../middleware/auth')

const { Rental } = require('../models/rental')

const router = express.Router()

router.post('/', auth, async (req, res) => {
	
	if (!req.body.customerId) return res.status(400).send('Invalid Customer Id')

	if (!req.body.movieId) return res.status(400).send('Invalid Movie Id')

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

module.exports = router