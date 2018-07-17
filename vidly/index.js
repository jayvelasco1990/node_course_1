require('express-async-errors')

const winston = require('winston')

require('winston-mongodb')

const config = require('config')

const express = require('express')

const Joi = require('joi')

Joi.objectId = require('joi-objectid')(Joi)

const app = express()

require('./startup/routes')(app)

require('./startup/db')()

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

if (!config.get('jwtPrivateKey')) {
	console.log('FATAL ERROR: jwtPrivateKey is not defined')
	process.exit(1)
}


app.get('/', (req, res) => {
	return res.send('Genre App')
})

const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`listening on port ${port}...`)
})