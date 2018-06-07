const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/playground')
	.then(()=>console.log('Connected to MongoDB...'))
	.catch(err => console.log('Could not connect to MongoDB...', err))

const courseSchema = new mongoose.Schema({
	name: {
		type: String, 
		required: true,
		minlength: 5,
		maxlength: 255
		// match: /pattern/
	},
	category: {
		type: String,
		required: true,
		enum: ['web', 'mobile', 'network'],
		lowercase: true,
		// uppercase: true,
		trim: true
	},
	author: String,
	tags: { 
		type: Array,
		validate: {
			isAsync: true,
			validator: function(v, callback) {
				setTimeout(() => {
					//Do some work
					const result = v && v.length > 0

					callback(result)
				}, 4000)
			},
			message: 'A course should have at least 1 tag'
		}
	},
	date: { type: Date, default: Date.now },
	isPublished: Boolean,
	price: {
		type: Number,
		required: function() { return this.isPublished },
		min: 10,
		max: 200,
		get: v => Math.round(v),
		set: v => Math.round(v)
	}
})

// Classes, objects
// Course, nodeCourse

const Course = mongoose.model('Course', courseSchema)

async function createCourse() {

	const course = new Course({
		name: 'Angular Course',
		author: 'Mosh',
		tags: ['frontend'],
		isPublished: true,
		category: 'Web',
		price: 15.8
	})
	
	try {

		const result = await course.save()

		console.log(result)
	}
	catch (ex) {
		for ( field in ex.errors ){
			console.log(ex.errors[field].message)
		}
	}
}

async function getCourses() {
	//eq (equal)
	//ne (not equal)
	//gt (greater than)
	//gte (greater than or equal to)
	//lt (less than)
	//lte (less than or equal to)
	//in
	//nin (not in)
	// .find({price: { $gte: 10, $lte: 20 } })
	// .find({ price: { $in: [10, 15, 20] } })
	//or
	//and
	// .find({ author: 'Mosh', isPublished: true})
	// .find()
	// .or([{ author: 'Mosh'}, { isPublished: true } ])
	// .and([])
	//starts with mosh
	// .find({ author: /^Mosh/ })
	//ends with Hamedani
	// .find({ author: /Hamedani$/i })
	//contains mosh
	//.find({ author: /.*Mosh.*/i})
	//.count()

	const pageNumber = 2
	const pageSize = 10

	//api/courses?pageNumber=2&pageSize=10

	const courses = await Course		
		.find({ _id: '5b189b064545e7568e66bdb6' })
		// .skip((pageNumber - 1) * pageSize)
		// .limit(pageSize)
		.sort({ name: 1})
		.select({ name: 1, tags: 1, price: 1})

	console.log(courses[0].price)
}

async function updateCourse(id) {

	const course = await Course.findByIdAndUpdate( { _id: id }, {
		$set: {
			author: 'Jason',
			isPublished: false
		}
	}, { new: true})

	console.log(course)
}

async function removeCourse(id) {

	// const result = await Course.deleteMany({ _id: id })
	const course = await Course.findByIdAndRemove(id)
	console.log(course)
}

// createCourse()

// removeCourse('5b1212320ebd15d19c18f3b5')

getCourses() 