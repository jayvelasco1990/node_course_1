const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/playground')
	.then(()=>console.log('Connected to MongoDB...'))
	.catch(err => console.log('Could not connect to MongoDB...', err))

const courseSchema = new mongoose.Schema({
	name: String,
	author: String,
	tags: [String],
	date: { type: Date, default: Date.now },
	isPublished: Boolean
})

// Classes, objects
// Course, nodeCourse

const Course = mongoose.model('Course', courseSchema)

async function createCourse() {

	const course = new Course({
		name: 'Angular Course',
		author: 'Mosh',
		tags: ['angular', 'frontend'],
		isPublished: true
	})

	const result = await course.save()

	console.log(result)
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
		.find({ author: 'Mosh', isPublished: true })
		.skip((pageNumber - 1) * pageSize)
		.limit(pageSize)
		.sort({ name: 1})
		.select({ name: 1, tags: 1})

	console.log(courses)
}

async function updateCourse(id) {
	//Approach: query first
	//find by id
	//modify its properties
	//save

	//Approach: update first
	//update directly
	//optionally: get the updated document
	const course = await Course.findById(id)

	if(!course) return;

	if (course.isPublished) return;

	course.set({
		isPublished: true,
		author: 'Another Author'
	})

	const result = await course.save()

	console.log(result)
}

updateCourse('5b1212320ebd15d19c18f3b5')

// getCourses() 