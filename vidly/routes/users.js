const _ = require('lodash')

const express = require('express')

const router = express.Router()

const bcrypt = require('bcrypt')

const auth = require('../middleware/auth')

const { User, validate } = require('../models/user')

router.get('/', async (req, res) => {

	const users = await User.find()

	res.send(users)

})

router.post('/', async (req, res) => {
	const { error } = validate(req.body)

	if (error) return res.status(400).send(error.details[0].message)

	try {

		const existingUser = await User.findOne({ email: req.body.email })

		if (existingUser) return res.status(400).send('user aleady exists')

		const user = new User(_.pick(req.body, [ 'name', 'email', 'password' ]))

		const salt = await bcrypt.genSalt(10)

		user.password = await bcrypt.hash(user.password, salt)

		await user.save()

		const token = user.generateAuthToken()

		res.header('x-auth-token', token).send(_.pick(user, [ '_id', 'name', 'email' ]))
	}
	catch (ex) {
		for (field in ex.errors){
			console.log(ex.errors[field].message)
		}
		console.log(ex)

		res.status(500).send('error saving')
	}
})


router.put('/:id', auth, async (req, res) => {

	const { error } = validate(req.body)

	if (error) return res.status(404).send(error.details[0].message)

	const user = await User.findByIdAndUpdate(req.params.id, {
		$set: {
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		}
	}, { new : true})

	if (!user) return res.status(404).send('User does not exist')

	res.send(user)

})

router.delete('/:id', auth, async (req, res) => {

	const user = await User.findByIdAndRemove(req.params.id)

	if (!user) return res.status(404).send('User does not exist')

	res.send(user)

})

router.get('/me', auth, async (req, res) => {

	const user = await User.findById(req.user._id).select('-password')

	res.send(user)

})

module.exports = router