const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Book = require('../models/book')

mongoose.set("bufferTimeoutMS", 30000)

const api = supertest(app)

const initialBooks = [{
    name: 'An Enemy Of The People',
    price: '400'
}, {
    name: 'The playbook',
    price: '900'
}]

beforeEach(async () => {
    await Book.deleteMany({})
    let bookObject = new Book(initialBooks[0])
    await bookObject.save()
    bookObject = new Book(initialBooks[1])
    await bookObject.save()
})

test('books are returned as json', async () => {
    await api
        .get('/api/books')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all books are returned', async () => {
    const response = await api.get('/api/books')
    expect(response.body).toHaveLength(initialBooks.length)
})

test('a specific book is within the returned books', async () => {
    const response = await api.get('/api/books')
    const names = response.body.map(r => r.name)
    expect(names).toContain('The playbook')
})

test('a valid book can be added', async () => {
    const newBook = {
        name: 'What works on wall street',
        price: '100'
    }

    await api
        .post('/api/books')
        .send(newBook)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/books')
    const names = response.body.map(r => r.name)

    expect(response.body).toHaveLength(initialBooks.length + 1)
    expect(names).toContain('What works on wall street')
}, 10000)

test('a book without name is not added', async () => {
    const newBook = {
        price: '100'
    }
    await api
        .post('/api/books')
        .send(newBook)
        .expect(400)

    const response = await api.get('/api/books')
    expect(response.body).toHaveLength(initialBooks.length)
})

afterAll(async () => {
    await mongoose.connection.close()
})