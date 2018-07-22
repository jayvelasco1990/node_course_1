const exercise = require('../exercise1')

describe('fizzBuzz', () => {
	it ('should throw if input is not a number', () => {
		expect(() => { exercise.fizzBuzz('a') }).toThrow()
		expect(() => { exercise.fizzBuzz(null) }).toThrow()
		expect(() => { exercise.fizzBuzz(undefined) }).toThrow()
		expect(() => { exercise.fizzBuzz({}) }).toThrow()
	})

	it ('should return FizzBuzz if divisible by 3 and 5', () => {
		const result = exercise.fizzBuzz(15)

		expect(result).toBe('FizzBuzz')
	})

	it ('should return Fizz if divisible by 3', () => {
		const result = exercise.fizzBuzz(3)

		expect(result).toBe('Fizz')
	})

	it ('should return Buzz if divisible by 5', () => {
		const result = exercise.fizzBuzz(5)

		expect(result).toBe('Buzz')
	})

	it ('should return input if the number is not divisible by 3 or 5', () => {
		const result = exercise.fizzBuzz(1)

		expect(result).toBe(1)
	})

})