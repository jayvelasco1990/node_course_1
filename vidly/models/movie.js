const mongoose = require('mongoose')

const Joi = require('joi')

const { Genre } = require('./genre')

//title
//genre
//numberInStock
//dailyRentalRate

const movieSchema = new mongoose.Schema({
	title: String
	genre: Genre,
	numberInStock: Number,
	dailyRentalRate: Number
})

const Movie = mongoose.model('Movie', movieSchema)

function validateMovie(movie) {
	const schema = {
		title: Joi.string().min(5).max(50).required()
	}
}

exports.Movie = Movie

exports.validate = validateMovie