// implement your posts router here
const express = require("express")
const Post = require("./posts-model")
const router = express.Router()

// GET (all posts)
router.get("/", (req, res) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({
        message: "The posts information could not be retrieved",
      })
    })
})

// GET specific post (via ID)
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post)
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" })
      }
    })
    .catch((err) => {
      console.error(err)
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" })
    })
})

// POST new post
router.post("/", (req, res) => {
  const { title, contents } = req.body
  if (title && contents) {
    Post.insert(req.body)
        .then(newPost => {
            res.status(201).json(newPost)
      })
      .catch((err) => {
        console.error(err)
        res
          .status(500)
          .json({
            message: "There was an error while saving the post to the database",
          })
      })
  } else {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" })
  }
})

// PUT 
router.put('/:id', (req, res) => {
    const changes = req.body
    const { title, contents } = changes
    if (title && contents) {
        Post.update(req.params.id, changes).then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        }).catch(err => {
            console.error(err)
            res.status(500).json({message: "The post information could not be modified"})
        })
    } else {
        res.status(400).json({message: "Please provide title and contents for the post"})
    }
})

// DELETE
router.delete('/:id', (req, res) => {
    Post.remove(req.params.id).then(deletedPost => {
        if (!deletedPost) {
            res.status(404).json({message: 'The post with the specified ID does not exist'})
        } else {
            res.status(200).json(deletedPost)
        }
    }).catch(err => {
        console.error(err)
        res.status(500).json({message: 'The post could not be removed'})
    })
})

// GET comments
router.get('/:id/comments', (req, res) => {
    Post.findPostComments(req.params.id).then(comments => {
        if (comments && comments.length > 0) {
            res.status(200).json(comments)
        } else {
            res.status(404).json({message: 'The post with the specified ID does not exist'})
        }
    }).catch((err) => {
        console.error(err)
        res.status(500).json({message: 'The comments information could not be retrieved'})
    })
})

module.exports = router
