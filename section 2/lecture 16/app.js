const os = require('os')

var totalMemory = os.totalmem()
var freeMemory = os.freemem()

// console.log('total memory: ' + totalMemory)
// console.log(freeMemory)

console.log(`Total memory: ${totalMemory}`)

console.log(`Free memory: ${freeMemory}`)