const authorsRouter = require('express').Router()
const bcrypt = require('bcrypt')

const Author = require('../models/author')

authorsRouter.get('/', async (request, response, next) => {
    try {
        const authors = await Author.find({}).populate('books', { name: '1', price: '1' })
        response.json(authors)
    } catch (exception) {
        next(exception)
    }
})

authorsRouter.get('/:id', async (request, response, next) => {
    try {
        const author = await Author.findById(request.params.id)
        if (author) {
            response.json(author)
        } else {
            response.status(204).end()
        }
    } catch (exception) {
        next(exception)
    }
})

authorsRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body
    const saltrounds = 10
    try {
        const passwordHash = await bcrypt.hash(password, saltrounds)
        const author = new Author({
            username,
            name,
            passwordHash
        })
        const createdAuthor = await author.save()
        response.status(201).json(createdAuthor)
    } catch (exception) {
        next(exception)
    }
})

authorsRouter.put('/', async (request, response, next) => {
    const { username, name, password } = request.body
    const id = request.params.id
    const saltrounds = 10

    try {
        const passwordHash = await bcrypt.hash(password, saltrounds)
        const author = {
            username,
            name,
            passwordHash
        }
        const updatedAuthor = await Author.findByIdAndUpdate(id, author, { new: true })
        response.json(updatedAuthor)
    } catch (exception) {
        next(exception)
    }
})

authorsRouter.delete('/', async (request, response, next) => {
    try {
        await Author.findByIdAndDelete(request.params.id)
        response.status(204)
    } catch (exception) {
        next(exception)
    }
})

module.exports = authorsRouter