const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (blog) {
      res.json(blog)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (req, res, next) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = new Blog({ ...req.body, user: user._id })
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (req, res, next) => {
  const { title, author, url, likes } = req.body

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, author, url, likes },
      { returnDocument: 'after', runValidators: true, context: 'query' }
    )
    res.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'forbidden: only the creator can delete this blog' })
    }

    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
