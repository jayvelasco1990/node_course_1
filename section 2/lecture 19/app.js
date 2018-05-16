const EventEmitter = require('events')

const emitter = new EventEmitter()

emitter.on('messageLogged', function(){
	console.log('listener called')
})

emitter.emit('messageLogged')



//making a noise - produce something
