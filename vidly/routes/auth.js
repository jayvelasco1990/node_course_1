const _ = require('lodash')

const express = require('express')

const router = express.Router()

const bcrypt = require('bcrypt')

const { User } = require('../models/user')

const Joi = require('joi')

const jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {

	const { error } = validate(req.body)

	if (error) return res.status(400).send(error.details[0].message)

	const user = await User.findOne({ email: req.body.email })

	if (!user) return res.status(400).send('Invalid email or password')

	const validPassword = await bcrypt.compare(req.body.password, user.password)
	
	if (!validPassword) return res.status(400).send('Invalid email or password')

	const token = jwt.sign({ _id: user._id }, 'jwtPrivateKey')
	
	res.send(token)
	
})

function validate(req) {

	const schema = {
		email: Joi.string().required(),
		password: Joi.string().required()
	}

	return Joi.validate(req, schema)
}

module.exports = router