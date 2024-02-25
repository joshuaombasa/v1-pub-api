const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    username:{type: String},
    name:{type: String},
    passwordHash:{type: String},
    books:[{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}]
})

authorSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('Author', authorSchema)