const mongoose = require('mongoose')

const genres = require('./routes/genres')

const customers = require('./routes/customers')

const movies = require('./routes/movies')

const rentals = require('./routes/rentals')

const users = require('./routes/users')

const express = require('express')

const Joi = require('joi')

const auth = require('./routes/auth')

Joi.objectId = require('joi-objectid')(Joi)

const app = express()

mongoose.connect('mongodb://localhost/vidly')
	.then(() => console.log('connected to mongoDB'))
	.catch(err => console.error('could not connect', err))

app.use(express.json())

app.use('/api/genres', genres)

app.use('/api/customers', customers)

app.use('/api/movies', movies)

app.use('/api/rentals', rentals)

app.use('/api/users', users)

app.use('/api/auth', auth)

app.get('/', (req, res) => {
	return res.send('Genre App')
})

const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`listening on port ${port}...`)
})