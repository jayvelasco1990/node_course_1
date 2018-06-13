const mongoose = require('mongoose')

const genres = require('./routes/genres')

const customers = require('./routes/customers')

const express = require('express')

const app = express()

mongoose.connect('mongodb://localhost/vidly')
	.then(() => console.log('connected to mongoDB'))
	.catch(err => console.error('could not connect', err))

app.use(express.json())

app.use('/api/genres', genres)

app.use('/api/customers', customers)

app.get('/', (req, res) => {
	return res.send('Genre App')
})

const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`listening on port ${port}...`)
})