const moment = require('moment')

const { Rental } = require('../../models/rental')

const request = require('supertest')

const mongoose = require('mongoose')

const { User } = require('../../models/user')

const { Movie } = require('../../models/movie')

let server

let customerId

let movieId

let rental

let token

describe('/api/returns', () => {
	
	beforeEach(async () => { 

		server = require('../../index') 

		customerId = mongoose.Types.ObjectId()

		movieId = mongoose.Types.ObjectId()

		rental = new Rental({
			customer: {
				_id: customerId,
				name: '12345',
				phone: '12345',
			},
			movie: movieId
		})

		await rental.save()

		const movie = new Movie({
			_id: movieId,
			title: '12345',
			dailyRentalRate: 2,
			numberInStock: 0
		})

		await movie.save()

		token = new User().generateAuthToken()

	})
	
	afterEach(async () => { 
		await Rental.remove({})

		await Movie.remove({})

		await server.close()
	})

	const exec = async () => {
		
		return request(server)
			.post('/api/returns')
			.set('x-auth-token', token)
			.send({ customerId, movieId })
	}

	it ('should return 401 if client is not logged in', async () => {
		token = ''

		const res = await exec()

		expect(res.status).toBe(401)
	})

	it ('should return 400 if customerId is not provided', async () => {
		customerId = null

		const res = await exec()

		expect(res.status).toBe(400)
	})

	it ('should return 400 if movieId is not provided', async () => {
		movieId = null

		const res = await exec()

		expect(res.status).toBe(400)
	})

	it ('should return 404 if no rental is found for this movie and customer id', async() => {
		await Rental.remove({})

		const res = await exec()

		expect(res.status).toBe(404)
	})

	it ('should return 400 if rental is already processed', async () => {

		rental.returnDate = Date.now()

		await rental.save()

		const res = await exec()

		expect(res.status).toBe(400)

	})

	it ('should return 200 if rental is valid', async () => {

		const res = await exec()

		expect(res.status).toBe(200)

	})

	it ('should set the return date', async () => {
		const res = await exec()

		const newRental = await Rental.findById(rental._id)

		const diff = Date.now() - newRental.returnDate

		expect(diff).toBeLessThan(10 * 1000)

		expect(newRental.returnDate).toBeTruthy()
	})

	it ('should calculate the rental fee (numberOfDays * movie.dailyRentalRate)', async () => {

		rental.checkoutDate = moment().add(-7, 'days').toDate()

		await rental.save()

		const res = await exec()

		const newRental = await Rental.findById(rental._id)

		expect(newRental.rentalFee).toBe(14)
	})

	it ('should increase the movie\'s stock', async () => {

		const res = await exec()

		const rentalInDb = await Rental.findById(rental._id).populate('movie')

		expect(rentalInDb.movie.numberInStock).toBe(1)
	})

	it ('should return rental', async () => {
		const res = await exec()

		const rentalInDb = await Rental.findById(rental._id)

		expect(Object.keys(res.body)).toEqual(
			expect.arrayContaining([
				'checkoutDate', 'returnDate', 'rentalFee', 'customer', 'movie'
			])
		)
	})
})
































