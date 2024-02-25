const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Path:', request.path)
    logger.info('Method:', request.method)
    logger.info('Body:', request.body)
    logger.info('___')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(400).json({ error: 'unknown endpoint' })
}

const errorHandling = (request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({
            error: 'expected `username` to be unique'
        })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }
    next()
}

module.exports = {requestLogger, errorHandling, unknownEndpoint}