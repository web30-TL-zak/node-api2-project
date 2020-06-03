const express = require('express')
const postsRouter = require('./api-router/posts-router')

const server = express()

server.use(express.json())
server.use('/api/posts', postsRouter)

server.get('/api', (req, res) => {
  res.status(200).json({ api: 'working' })
})

const PORT = 8001
server.listen(PORT, () => console.log(`Listening on port ${PORT}`))