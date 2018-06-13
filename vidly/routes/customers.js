const mongoose = require('mongoose')

const express = require('express')

const Joi = require('joi')

const router = express.Router()

const customersSchema = new mongoose.Schema({
	isGold: Boolean,
	name: String,
	phone: String
})

const Customer = mongoose.model('Customer', customersSchema)

router.get('/', async (req, res) => {
	const customers = await Customer.find().sort('name')

	res.send(customers)
})

router.post('/', async (req, res) => {
	try{
		let customer = new Customer({
			isGold: req.body.isGold,
			name: req.body.name,
			phone: req.body.phone
		})

		customer = await customer.save()

		if (!customer) return res.status(404).send('customer does not exist')

		res.send(customer)
	}
	catch(ex){
		for (field in ex.errors) {
			ex.errors[field].message
		}
	}
})

router.put('/:id', async (req, res) => {
	const customer = await Customer.findByIdAndUpdate(req.params.id, {
		$set: {
			isGold: req.body.isGold,
			name: req.body.name,
			phone: req.body.phone
		}
	}, { new: true })

	if(!customer) return res.status(404).send('customer does not exist')

	res.send(customer)
})

router.delete('/:id', async (req, res) => {
	const customer = await Customer.findByIdAndRemove(req.params.id)

	if (!customer) return res.status(404).send('customer does not exist')

	res.send(customer)
})

router.get('/:id', async (req, res) => {
	const customer = await Customer.findById(req.params.id)

	if (!customer) return res.status(404).send('customer does not exist')

	res.send(customer)
})

module.exports = router
