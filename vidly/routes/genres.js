const mongoose = require('mongoose')

const express = require('express')

const Joi = require('joi')

const router = express.Router()

const genreSchema = new mongoose.Schema({
	name: { 
		type: String,
		required: true,
		minLength: 5,
		maxLength: 50
	}
})

const Genre = mongoose.model('Genre', genreSchema)

router.get('/', async (req, res) => {

	const genres = await Genre.find().sort('name')

	res.send(genres)

})

router.post('/', async (req, res) => {

	const { error } = validateGenre(req.body)

	if (error) return res.status(400).send(error.details[0].message)

	try{
		
		let genre = new Genre({ name: req.body.name })

		genre = await genre.save()

		res.send(genre)
	}
	catch(ex) {
		for (field in ex.errors) {
			console.log(ex.errors[field].message)
		}
	}

})

router.put('/:id', async (req, res) => {

	const { error } = validateGenre(req.body)

	if (error) return res.status(400).send(error.details[0].message)
	
	const genre = await Genre.findByIdAndUpdate(req.params.id, {
		$set: {
			name: req.body.name
		}
	}, { new: true })

	if(!genre) return res.status(404).send('Genre does not exist.')

	res.send(genre)
	
})

router.delete('/:id', async (req, res) => {

	const genre = await Genre.findByIdAndRemove(req.params.id)

	if(!genre) return res.status(404).send('Genre does not exist.')

	res.send(genre)

})

router.get('/:id', async (req, res) => {

	const genre = await Genre.findById(req.params.id)
	
	if(!genre) return res.status(404).send('Genre does not exist.')

	res.send(genre)

})

function validateGenre(genre) {
	const schema = {
		name: Joi.string().min(2).required()
	}

	return Joi.validate(genre, schema)
}

module.exports = router