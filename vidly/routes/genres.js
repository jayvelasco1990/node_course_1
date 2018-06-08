const express = require('express')

const router = express.Router()

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/genres')
	.then(()=>console.log('connected to mongoDB'))
	.catch(err => console.log('could not connect', err))

const genreSchema = new mongoose.Schema({
	id: Number,
	genre: String
})

const Genre = mongoose.model('Genre', genreSchema)
// const genres = [
// 	{ id: 1, genre: 'comedy' }
// ]

router.get('/', (req, res) => {
	const genres = await Genre.find()

	res.send(genres)
})

router.get('/:id', (req, res) => {
	const genre = await Genre.findOne({ id: req.params.id})

	if(!genre) return res.status(404).send('Genre does not exist.')

	res.send(genre)
})

router.post('/', (req, res) => {
	const { error } = validateGenre(req.body)

	if (error) return res.status(400).send(error.details[0].message)

	const genre = new Genre({
		id: genres.length + 1,
		genre: req.body.genre
	})

	try{
		const genre = await genre.save()

		res.send(genre)
	}
	catch(ex) {
		for (field in ex.errors) {
			console.log(ex.errors[field].message)
		}
	}
})

router.put('/:id', (req, res) => {
	const genre = genres.find(g => g.id === parseInt(req.params.id))

	if(!genre) return res.status(404).send('Genre does not exist.')

	const { error } = validateGenre(req.body)

	if (error) return res.status(400).send(error.details[0].message)

	const genre = await Genre.findByIdAndUpdate({id: req.params.id}, {
		$set: {
			genre: req.body.genre
		}
	}, { new: true })

	
	res.send(genre)
})

router.delete('/:id', (req, res) => {
	const genre = genres.find(g => g.id === parseInt(req.params.id))

	if(!genre) return res.status(404).send('Genre does not exist.')

	var index = genres.indexOf(genre)

	genres.splice(index, 1)

	res.send(genre)
})

function validateGenre(genre) {
	const schema = {
		genre: Joi.string().min(2).required()
	}

	const result = Joi.validate(genre, schema)

	return result
}

module.exports = router