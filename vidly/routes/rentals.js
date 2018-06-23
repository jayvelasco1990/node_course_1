const express = require('express')

const router = express.Router()

const { Rental, validate } = require('../models/rental')

router.get('/', async (req, res) => {
	const rentals = await Rental.find()
	.populate('genre')
	.populate('customer')
	.populate('movie')

	res.send(rentals)
})

module.exports = router