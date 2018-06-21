const express = require('express')

const router = express.Router()

const { Movie, validate } = require ('../models/movie')

router.get('/', async (req, res) => {
	const movies = await Movie.find().populate('genre').sort('title')

	res.send(movies)
})

router.post('/', async (req, res) => {

	const { error } = validate(req.body)

	if (error) return res.status(404).send(error.details[0].message + ' bad model')

	try {
		let movie = new Movie({
			title: req.body.title,
			genre: req.body.genreId,
			numberInStock: req.body.numberInStock,
			dailyRentalRate: req.body.dailyRentalRate
		})

		movie = await movie.save()

		if (!movie) return res.status(404).send('movie does not exist')

		res.send(movie)
	}
	catch (ex) {
		for (field in ex.errors) ex.errors[field].message
	}
})

router.put('/:id', async (req, res) => {
	const movie = await Movie.findByIdAndUpdate(req.params.id, {
		$set: {
			title: req.body.title,
			genre: req.body.genreId,
			numberInStock: req.body.numberInStock,
			dailyRentalRate: req.body.dailyRentalRate
		}
	}, { new: true })

	if(!movie) res.status(404).send('movie not found')

	res.send(movie)
})

router.delete('/:id', async (req, res) => {
	const movie = await Movie.findByIdAndRemove(req.params.id)

	if(!movie) res.status(404).send('movie not found')

	res.send(movie)
})

router.get('/:id', async (req, res) => {
	const movie = await Movie.findById(req.params.id)

	if(!movie) res.status(404).send('movie not found')

	res.send(movie)
})

module.exports = router