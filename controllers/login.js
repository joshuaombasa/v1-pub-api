const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Author = require('../models/author')
const loginRouter = require('express').Router()
require('dotenv').config()

loginRouter.post('/', async (request, response, next) => {
    const { username, password } = request.body
    const author = await Author.findOne({ username })
    const passwordcorrect = await bcrypt.compare(password, author.passwordHash)

    if (!(author && passwordcorrect)) {
        response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: author.username,
        id: author._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: 60*60})

    response
        .status(200)
        .json({ token, username: author.username, name: author.name })
})




module.exports = loginRouter