const booksRouter = require('express').Router()

const Book = require('../models/book')
const Author = require('../models/author')

const getTokenFrom  =(request) => {
    const authorization = request.get('authorization')

    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ','')
    }

    return null
}

booksRouter.get('/', async (request,response,next) => {
    try {
        const books = await Book.find({}).populate({username:'1', name: '1'})
        response.json(books)
    } catch (exception) {
        next(exception)
    }
})

booksRouter.get('/:id', async (request,response,next) => {
    try {
        const book = await Book.findById(request.params.id).populate({username:'1', name: '1'})
        if(book) {
            response.json(book)
        } else {
            response.status(204).end()
        }
    } catch (exception) {
        next(exception)
    }
})

booksRouter.post('/', async (request,response,next) => {
    const {name, price} = request.body

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    
    if(!decodedToken.id) {
        response.status(401).json({error: 'token invalid'})
    }

    const book = new Book({
        name,
        price
    })
    try {
        const author = await Author.find(decodedToken.id)
        const savedBook = await book.save()
        author.books = author.books.concat(savedBook._id)
        await author.save()
        response.status(201).json(savedBook)
    } catch (exception) {
        next(exception)
    }
})

booksRouter.put('/:id', async (request,response,next) => {
    const id = request.params.id
    const {name, price} = request.body
    const book = {name,price}

    try {
        const updatedBook = await Book.findByIdAndUpdate(id,book,{new:true})
        response.json(updatedBook)
    } catch (exception) {
        next(exception)
    }
})

booksRouter.delete('/', async (request,response,next) => {
    try {
        await Book.findByIdAndDelete(request.params.id)
        res.status(204).end()
    } catch (exception) {
        next(exception)
    }
})

module.exports = booksRouter