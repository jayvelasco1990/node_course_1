const request = require('supertest')

const { Genre } = require('../../models/genre')

const mongoose = require('mongoose')

let server = null

describe('/api/genres', () => {

	beforeEach(() => { server = require('../../index') })

	afterEach(async () => { 
		server.close()

		await Genre.remove({})
	})

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
		it ('should return genre by id', async () => {
			
			const newGenre = {name: 'genre1' }

			await Genre.collection.insertOne(newGenre)
			
			const res = await request(server).get(`/api/genres/${newGenre._id}`)
			
			expect(res.body.name).toBe(newGenre.name)
		})

		it ('should return a 404 status', async () => {

			const res = await request(server).get(`/api/genres/${mongoose.Types.ObjectId()}`)

			expect(res.status).toBe(404)

		})
	})
})