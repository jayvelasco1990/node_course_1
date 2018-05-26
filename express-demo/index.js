const debug = require('debug')('app:startup')

const morgan = require('morgan')

const config = require('config')

const helmet = require('helmet')

const Joi = require('joi')

const logger = require('./logger')

const authenticator = require('./authenticator')

const express = require('express')

const app = express()

app.set('view engine', 'pug')

app.set('views', './views') //default

app.use(express.json())

app.use(express.urlencoded({ extended: true })) //key=value&key=value (req.body)

app.use(express.static('public'))

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

const courses = [
	{ id: 1, name: 'course1' },
	{ id: 2, name: 'course2' },
	{ id: 3, name: 'course3' },
]

app.get('/', (req, res)=> {
	res.render('index', { title: 'My Express App', message: 'Hello'})
})

app.get('/api/courses', (req, res) => {
	res.send(courses)
})

app.post('/api/courses', (req, res) => {

	const { error } = validateCourse(req.body)

	if(error) return res.status(400).send(error.details[0].message)

	const course = {
		id: courses.length + 1,
		name: req.body.name
	}

	courses.push(course)

	res.send(course)
})

// /api/courses/1
app.get('/api/courses/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id))

	if(!course) return res.status(404).send('The course with the given ID was not found')

	res.send(course)
})

app.put('/api/courses/:id', (req, res) => {
	
	const course = courses.find(c => c.id === parseInt(req.params.id))

	if(!course) return res.status(404).send('The course with the given ID was not found')

	const { error } = validateCourse(req.body)

	if(error) return res.status(400).send(error.details[0].message)

	course.name = req.body.name

	res.send(course)
})

function validateCourse(course){

	const schema = {
		name: Joi.string().min(3).required()
	}

	const result = Joi.validate(course, schema)

	return result
}

app.delete('/api/courses/:id', (req, res) =>{
	const course = courses.find(c => c.id === parseInt(req.params.id))

	if(!course) return res.status(404).send('The course with the given ID was not found')

	var index = courses.indexOf(course)

	courses.splice(index, 1)

	res.send(course)
})

//port
const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`listening on port ${port}...`)
})

