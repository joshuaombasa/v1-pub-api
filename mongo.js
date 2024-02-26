const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

console.log('connecting to', "mongodb://127.0.0.1:27017/pubTestAPP?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1")

mongoose.connect("mongodb://127.0.0.1:27017/pubTestAPP?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1").then(() => {
console.log('connected to mongodb')
}).catch(error => console.log(error))

const bookSchema = new mongoose.Schema({
    name:{type: String},
    price:{type: String},
    author:{type: mongoose.Schema.Types.ObjectId, ref: 'Author'}
})

bookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Book = mongoose.model('Book', bookSchema)
const book = new Book({
    name: 'Utengano',
    price: '700'
})

book.save().then(() => console.log('book saved')).catch(error => console.log(error))

