const express = require('express')

const router = express.Router()

const { Movie, validate } = require ('../models/movie')

router.get('/', async (req, res) => {
	const movies = await Movie.find().sort('title')

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

module.exports = router