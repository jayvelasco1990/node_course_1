const express = require('express')

const router = express.Router()

const { Rental, validate } = require('../models/rental')

const Fawn = require('fawn')

const mongoose = require('mongoose')

const { Movie } = require('../models/movie')

Fawn.init(mongoose)

router.get('/', async (req, res) => {

	const rentals = await Rental.find()
	.populate('customer')
	.populate({
		path: 'movie',
		populate: {
			path: 'genre',
			model: 'Genre'
		}
	})

	res.send(rentals)
})

router.post('/', async (req, res) => {

	const { error } = validate(req.body)

	if (error) return res.status(404).send(error.details[0].message + ' bad model')

	try{

		const movie = await Movie.findById(req.body.movie)

		if (!movie) return res.status(404).send('movie does not exist')

		if (movie.numberInStock == 0) return res.status(404).send('out of movies')

		let rental = new Rental({
			movie: req.body.movie,
			genre: req.body.genre,
			customer: req.body.customer,
			checkoutDate: req.body.checkoutDate,
			returnDate: req.body.returnDate,
			rentalFee: req.body.rentalFee
		})

		new Fawn.Task()
			.save('rentals', rental)
			.update('movies', { _id: movie._id }, {
				$inc: { numberInStock: -1}
			})
			.run()

		res.send(rental)
	}
	catch(ex) {
		console.log(ex)
		for (field in ex.errors) ex.errors[field].message

		res.status(500).send('failed to save')
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
