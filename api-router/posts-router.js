const router = require('express').Router()

const Posts = require('../data/db')

router.get('/', (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => res.status(500).json({ error: "The posts information could not be retrieved." }))
})

router.get('/:id', (req, res) => {
  const { id } = req.params

  Posts.findById(id)
    .then(post => {
        if(post.length === 0){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            res.status(200).json(post)
        }  
    })
    .catch(err => {
      res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

router.get('/:id/comments', (req, res) => {
  const { id } = req.params

  Posts.findById(id)
    .then(post => {
        if(post.length === 0){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            Posts.findPostComments(id)
            .then(comments => {
              res.status(200).json(comments)
            })
            .catch(err => {
              res.status(500).json({ error: "The comments information could not be retrieved." })
            })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The post information could not be retrieved." })
    })

  
})

router.delete('/:id', (req, res) => {
  const { id } = req.params

  Posts.findById(id)
    .then(post => {
      if (post.length === 0) {
        res.status(404).json({ error: 'cannot find that post' })
      } else {
        Posts.remove(id)
          .then(() => {
            res.status(200).json(post)
          })
          .catch(err => {
            res.status(500).json({ error: "The post could not be removed" })
          })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "server error finding the post"})
    })
})

router.put('/:id', (req, res) => {
  const { id } = req.params
  const update = req.body

  Posts.findById(id)
    .then(post => {
      Posts.update(id, update)
        .then(count => {
          Posts.find()
            .then(posts => {
              res.status(200).json(posts)
            })
            .catch(() => console.log({ findError: 'error finding' }))
        })
        .catch(() => console.log({ updateError: 'error updating' }))
    })
    .catch(() => console.log({ findByIdError: 'error finding id' }))
})

router.post('/', (req, res) => {
  const post = req.body

  if (!post.title || !post.contents) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide title and contents for the post.' })
  } else {
    Posts.insert(post)
      .then(() => {
        Posts.find()
          .then(posts => res.status(201).json(posts))
          .catch(() =>
            res
              .status(500)
              .json({ error: 'There was an error finding the posts' })
          )
      })
      .catch(() =>
        res.status(500).json({
          error: 'There was an error while saving the post to the database'
        })
      )
  }
})

router.post('/:id/comments', (req, res) => {
  const { id } = req.params
  const comment = req.body

  Posts.findById(id)
    .then(post => {
      if (post.length === 0) {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' })
      } else if (!comment.text) {
        res
          .status(400)
          .json({ errorMessage: 'Please provide text for the comment.' })
      } else {
        Posts.insertComment(comment)
          .then(() => {
            Posts.findPostComments(id)
              .then(comments => {
                res.status(201).json(comments[comments.length - 1])
              })
              .catch(err => {
                res.status(500).json(err.response)
              })
          })
          .catch(err => {
              res.status(500).json({ error: "There was an error while saving the comment to the database" })
          })
      }
    })
    .catch()
})

module.exports = router
