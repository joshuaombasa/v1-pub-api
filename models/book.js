const mongoose = require('mongoose')

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

module.exports = mongoose.model('Book', bookSchema)