const express = require('express')

const router = express.Router()

const { User, validate } = require('../models/user')

router.get('/', async (req, res) => {

	const users = await User.find()

	res.send(users)

})

router.post('/', async (req, res) => {
	const { error } = validate(req.body)

	if (error) return res.status(404).send(error.details[0].message)

	try {
		const user = new User({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		})

		await user.save()

		res.send(user)
	}
	catch (ex) {
		for (field in ex.errors){
			console.log(ex.errors[field].message)
		}

		res.status(500).send('error saving')
	}
})

router.put('/:id', async (req, res) => {

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

router.delete('/:id', async (req, res) => {

	const user = await User.findByIdAndRemove(req.params.id)

	if (!user) return res.status(404).send('User does not exist')

	res.send(user)

})

router.get('/:id', async (req, res) => {
	const user = await User.findById(req.params.id)

	if (!user) return res.status(404).send('User does not exist')

	res.send(user)

})

module.exports = router