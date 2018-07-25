const { User } = require('../models/user')

describe('user', () => {
	it('should return a token', () => {
		
		const user = new User({ _id: '5b418f985b28acafa3c329f7', email: 'jv@test7.com', password: '$2b$10$mmWks.Cv8WBF7W1JJs2vc.ANQen0AmB5DBNtpK1iBQ99KP1ebdU.W'})
		const result = user.generateAuthToken()
		expect(result).toBeDefined()
	})
})