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

router.post('/', async (req, res) => {

	const { error } = validate(req.body)

	if (error) return res.status(404).send(error.details[0].message + ' bad model')

	try{
		let rental = new Rental({
			movie: req.body.movie,
			genre: req.body.genre,
			customer: req.body.customer,
			checkoutDate: req.body.checkoutDate,
			returnDate: req.body.returnDate,
			rentalFee: req.body.rentalFee
		})

		rental = await rental.save()

		if (!rental) return res.status(404).send('failed to save rental')

		res.send(rental)
	}
	catch(ex) {
		for (field in ex.errors) ex.errors[field].message
	}
})

router.put('/:id', async (req, res) => {

	const rental = await Rental.findByIdAndUpdate(req.params.id, {
		$set: {
			movie: req.body.movie,
			genre: req.body.genre,
			customer: req.body.customer,
			checkoutDate: req.body.checkoutDate,
			returnDate: req.body.returnDate,
			rentalFee: req.body.rentalFee
		}
	}, { new: true })

	if (!rental) return res.status(404).send('rental was not found')

	res.send(rental)
})

router.delete('/:id', async (req, res) => {

	const rental = await Rental.findByIdAndRemove(req.params.id)

	if (!rental) return res.status(404).send('rental was not found')

	res.send(rental)
})

router.get('/:id', async (req, res) => {
	
	const rental = await Rental.findById(req.params.id)

	if (!rental) return res.status(404).send('rental does not exist')

	res.send(rental)

})

module.exports = router
