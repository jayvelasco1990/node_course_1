const mongoose = require('mongoose')

const Joi = require('joi')

const { genreSchema } = require('./genre')

const movieSchema = new mongoose.Schema({
	title: String,
	genre: {
		type: mongoose.Schema.Types.ObjectId,
	    ref: 'Genre'
	},
	numberInStock: Number,
	dailyRentalRate: Number
})

const Movie = mongoose.model('Movie', movieSchema)

function validateMovie(movie) {
	const schema = {
		title: Joi.string().min(5).max(50).required(),
		genreId: Joi.string(),
		numberInStock: Joi.number(),
		dailyRentalRate: Joi.number()
	}

	return Joi.validate(movie, schema)
}

exports.Movie = Movie

exports.validate = validateMovie