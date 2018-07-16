require('express-async-errors')

const winston = require('winston')

require('winston-mongodb')

const mongoose = require('mongoose')

const error = require('./middleware/error')

const config = require('config')

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

winston.handleExceptions(new winston.transports.File({
	filename: 'uncaughtExceptions.log'
}))

process.on('unhandledRejection', (ex) => {
	throw ex
})

winston.add(winston.transports.File, { filename: 'logfile.log'})

winston.add(winston.transports.MongoDB, { 
	db: 'mongodb://localhost/vidly',
	level: 'info'
})

const p = Promise.reject(new Error('something failed miserably'))

p.then(() => console.log('Done'))

if (!config.get('jwtPrivateKey')) {
	console.log('FATAL ERROR: jwtPrivateKey is not defined')
	process.exit(1)
}

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

app.use(error)

app.get('/', (req, res) => {
	return res.send('Genre App')
})

const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`listening on port ${port}...`)
})