const request = require('supertest')

const { User } = require('../../models/user')

let server = null

describe('auth middleware', () => {
	
	beforeEach(() => { server = require('../../index') })

	afterEach(() => server.close())
	
	let token;

	const exec = () => {
		return request(server)
		.set('x-auth-token', token)
		.post('/api/genres').send({ name: 'genre1' })
	}

	beforeEach(()=> {
		token = new User().generateAuthToken()
	})

	it ('should return 401 if no token is provided', async () => {

		token = ''

		const response = await exec()

		expect(response.status).toBe(401)
	})
})