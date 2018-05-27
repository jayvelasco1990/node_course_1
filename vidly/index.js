const Joi = require('joi')

const genres = require('./routes/genres')

const express = require('express')

const app = express()

app.use(express.json())

app.use('/api/genres', genres)

app.get('/', (req, res) => {
	return res.send('Genre App')
})

const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`listening on port ${port}...`)
})