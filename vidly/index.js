const Joi = require('joi')

const express = require('express')

const app = express()

app.use(express.json())

const genres = [
	{ id: 1, genre: 'comedy' }
]

app.get('/', (req, res) => {
	return res.send('Genre App')
})

app.get('/api/genres', (req, res) => {
	res.send(genres)
})

app.get('/api/genres/:id', (req, res) => {
	const genre = genres.find(g => g.id === parseInt(req.params.id))

	if(!genre) return res.status(404).send('Genre does not exist.')

	res.send(genre)
})

app.post('/api/genres', (req, res) => {
	const { error } = validateGenre(req.body)

	if (error) return res.status(400).send(error.details[0].message)

	const genre = {
		id: genres.length + 1,
		genre: req.body.genre
	}

	genres.push(genre)

	res.send(genre)
})

app.put('/api/genres/:id', (req, res) => {
	const genre = genres.find(g => g.id === parseInt(req.params.id))

	if(!genre) return res.status(404).send('Genre does not exist.')

	const { error } = validateGenre(req.body)

	if (error) return res.status(400).send(error.details[0].message)

	genre.genre = req.body.genre
	
	res.send(genre)
})

app.delete('/api/genres/:id', (req, res) => {
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

const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`listening on port ${port}...`)
})