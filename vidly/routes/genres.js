const express = require('express')

const Joi = require('joi')

const router = express.Router()

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/genres')
	.then(()=>console.log('connected to mongoDB'))
	.catch(err => console.log('could not connect', err))

const genreSchema = new mongoose.Schema({
	genre: String
})

const Genre = mongoose.model('Genre', genreSchema)

router.get('/', (req, res) => {
	getGenres().then(result => res.send(result))
})

router.get('/:id', (req, res) => {
	getGenre(req.params.id)
	.then(genre => {
		if(!genre) return res.status(404).send('Genre does not exist.')

		res.send(genre)
	})
})

router.post('/', (req, res) => {
	const { error } = validateGenre(req.body)

	if (error) return res.status(400).send(error.details[0].message)

	try{
		
		saveGenre(req.body.genre).then((result)=> res.send(result))
	}
	catch(ex) {
		for (field in ex.errors) {
			console.log(ex.errors[field].message)
		}
	}
})

router.put('/:id', (req, res) => {

	updateGenre(req)
	.then((genre)=>{

		if(!genre) return res.status(404).send('Genre does not exist.')

		const { error } = validateGenre(req.body)

		if (error) return res.status(400).send(error.details[0].message)

		res.send(genre)
	})
	.catch((err)=>{
		return res.status(400).send(err.message)
	})
	
})

router.delete('/:id', (req, res) => {
	deleteGenre(req.params.id)
	.then((genre)=>{
		if(!genre) return res.status(404).send('Genre does not exist.')
			
		res.send(genre)
	})
})

async function getGenres() {
	const genres = await Genre.find()

	return genres
}

async function getGenre(id) {
	const genre = await Genre.findOne({ _id: id})

	return genre
}

async function saveGenre(genre) {
	
	const newGenre = new Genre({
		genre: genre
	})

	const result = await newGenre.save()
	console.log(result)
	return result
}

async function updateGenre(req) {
	const id = req.params.id

	const genre = await Genre.findByIdAndUpdate({_id: id}, {
		$set: {
			genre: req.body.genre
		}
	}, { new: true })

	return genre
}

async function deleteGenre(id) {
	return await Genre.findByIdAndRemove(id)
}

function validateGenre(genre) {
	const schema = {
		genre: Joi.string().min(2).required()
	}

	const result = Joi.validate(genre, schema)

	return result
}

module.exports = router