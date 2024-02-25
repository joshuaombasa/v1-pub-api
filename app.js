const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const booksRouter = require('./controllers/books')
const authorsRouter = require('./controllers/authors')
const loginRouter = require('./controllers/login')

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGO_URI)
        .then(() => logger.info('connected to mongo'))
        .catch(error => logger.error(error.message))

const app = express()



app.use(middleware.requestLogger)
app.use('/api/books', booksRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandling)

module.exports = app