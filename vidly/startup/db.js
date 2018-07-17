const mongoose = require('mongoose')

const winston = require('winston')

module.exports = function() {
	
	const connectionString = 'mongodb://localhost/vidly'

	mongoose.connect(connectionString)
		.then(() => winston.info('connected to mongoDB'))

}