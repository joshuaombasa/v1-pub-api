require('dotenv').config()



const PORT = process.env.PORT
console.log(PORT)
const MONGO_URI = process.env.MONGODB_URI
console.log(MONGO_URI)

module.exports = {PORT, MONGO_URI}