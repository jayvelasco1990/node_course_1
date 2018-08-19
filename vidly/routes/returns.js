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

	const oneDay = 24*60*60*1000

	const firstDate = rental.returnDate.getTime()

	const secondDate = rental.checkoutDate.getTime()

	const diffDays = Math.round((firstDate - secondDate) / oneDay)

	rental.rentalFee = diffDays * rental.movie.dailyRentalRate

	await rental.save()

	return res.status(200).send('Valid request')

})

module.exports = router