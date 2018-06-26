const mongoose = require('mongoose')

const id = new mongoose.Types.ObjectId()

console.log(id.getTimestamp())

const isValid = mongoose.Types.ObjectId.isValid('1234')

console.log(isValid)

// _id: 5b2e61744f2f8603fddb41e5

//12 bytes
	//4 bytes: timestamp
	//3 bytes: machine identifier
	//2 bytes: process identifier
	//3 bytes: counter

//1 byte = 8 bits

// 2 ^ 8 = 256

// 2 ^ 24 = 16M

//mongo db driver -> mongodb
//Driver -> MongoDB
