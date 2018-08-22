const Joi = require('joi')

const express = require('express')

const auth = require('../middleware/auth')

const { Rental } = require('../models/rental')

const router = express.Router()

const validate = require('../middleware/validate')

router.post('/', [auth, validate(validateReturn)], async (req, res) => {

	//Static: Rental.lookup
	//Instance: new User().generateAuthToken()

	const rental = await Rental.lookup(req.body.customerId, req.body.movieId )

	if (!rental) return res.status(404).send('No rental found for this customer/movie')

	if (rental.returnDate) return res.status(400).send('Rental already processed')

	//information expert principal
	rental.return()

	await rental.save()

	await rental.movie.save()

	return res.send(rental)

})

function validateReturn(req) {
	const schema = {
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required()
	}

	return Joi.validate(req, schema)
}

module.exports = router