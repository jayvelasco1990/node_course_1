const request = require('supertest')

const { Genre } = require('../../models/genre')

const { User } = require('../../models/user')

const mongoose = require('mongoose')

let server

describe('/api/genres', () => {

	beforeEach(() => { server = require('../../index') })
	
	afterEach(async () => { 
		await Genre.remove({})
	})

	const user = { 
		_id: mongoose.Types.ObjectId().toHexString(), 
		isAdmin: true 
	}

	const token = new User(user).generateAuthToken()

	describe('GET /', () => {

		it ('should return all genres', async () => {

			await Genre.collection.insertMany([
				{ name: 'genre1' },
				{ name: 'genre2' }
			])
			
			const res = await request(server).get('/api/genres')

			expect(res.status).toBe(200)

			expect(res.body.length).toBe(2)

			expect(res.body.some(g => g.name === 'genre1')).toBeTruthy()

			expect(res.body.some(g => g.name === 'genre2')).toBeTruthy()
		})
	})

	describe('GET /:id', () => {

		it ('should return genre if valid id is passed', async () => {
			
			const newGenre = {name: 'genre1' }

			await Genre.collection.insertOne(newGenre)
			
			const res = await request(server).get(`/api/genres/${newGenre._id}`)
			
			expect(res.status).toBe(200)

			expect(res.body.name).toBe(newGenre.name)
		})

		it ('should return a 404 status if invalid id is passed', async () => {

			const res = await request(server).get(`/api/genres/1`)

			expect(res.status).toBe(404)

		})

		it ('should return a 404 status if no genre with the given id exists', async () => {

			const res = await request(server).get(`/api/genres/${mongoose.Types.ObjectId()}`)

			expect(res.status).toBe(404)

		})
	})

	describe('DELETE /:id', () => {

		it ('should delete genre when passed a valid id', async () => {
			const newGenre = { name: 'genre1' }

			await Genre.collection.insertOne(newGenre)

			const res = await request(server)
				.delete(`/api/genres/${newGenre._id}`)
				.set('x-auth-token', token)

			expect(res.status).toBe(200)

			expect(res.body.name).toBe(newGenre.name)

		})

		it ('should return a 404 status if no genre with the given id exists', async() => {
			const res = await request(server)
				.delete(`/api/genres/${mongoose.Types.ObjectId()}`)
				.set('x-auth-token', token)

			expect(res.status).toBe(404)
		})
	})

	describe('PUT /:id', () => {
		it ('should return a 400 status if body is invalid', async () => { 
			const newGenre = { name: 'genre1' }

			await Genre.collection.insertOne(newGenre)

			const res = await request(server)
				.put(`/api/genres/${newGenre._id}`)
				.set('x-auth-token', token)

			expect(res.status).toBe(400)

		})

		it ('should return a 404 status if the genre does not exist', async () => {
			const genre = { name: 'genre1' }

			const res = await request(server)
				.put(`/api/genres/${mongoose.Types.ObjectId()}`)
				.send(genre)
				.set('x-auth-token', token)

			expect(res.status).toBe(404)
		})
	})

	describe('POST /', () => {

		// Define the happy path, then in each test, we change
		// one parameter that clearly aligns with then name of the
		// test

		let token;
		let name;

		const exec = async () => {
			return await request(server)
				.post('/api/genres')
				.set('x-auth-token', token)
				.send({ name })
		}

		beforeEach(() => {
			token = new User().generateAuthToken()
			name = 'genre1'
		})

		it ('should return a 401 if client is not logged in', async () => {
			token = ''

			const response = await exec()

			expect(response.status).toBe(401)
		})

		it ('should return a 400 if genre is less than 5 characters', async () => {			

			name = '1234'

			const response = await exec()

			expect(response.status).toBe(400)
		})

		it ('should return a 400 if genre is more than 50 characters', async () => {
			
			name = new Array(52).join('a')

			const response = await exec()

			expect(response.status).toBe(400)
		})

		it ('should save the genre if it is valid', async () => {
			
			await exec()

			const genre = await Genre.find({ name: 'genre1' })

			expect(genre).not.toBeNull()

		})

		it ('should return the genre if it is valid', async () => {
			
			const res = await exec()

			expect(res.body).toHaveProperty('_id')

			expect(res.body).toHaveProperty('name', 'genre1')
			
		}) 
	})
})