const debug = require('debug')('app:startup')

const morgan = require('morgan')

const config = require('config')

const helmet = require('helmet')

const Joi = require('joi')

const logger = require('./middleware/logger')

const authenticator = require('./authenticator')

const courses = require('./routes/courses')

const home = require('./routes/home')

const express = require('express')

const app = express()

app.set('view engine', 'pug')

app.set('views', './views') //default

app.use(express.json())

app.use(express.urlencoded({ extended: true })) //key=value&key=value (req.body)

app.use(express.static('public'))

app.use('/api/courses', courses)

app.use('/', home)

app.use(helmet())

//Configuration
console.log('Application Name: ' + config.get('name'))

console.log('Mail Server: ' + config.get('mail.host'))

console.log('Mail Password: ' + config.get('mail.password'))

if(app.get('env') === 'development') {
	app.use(morgan('tiny'))
	debug('Morgan enabled...')
} 

app.use(logger)

app.use(authenticator)


//port
const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`listening on port ${port}...`)
})

