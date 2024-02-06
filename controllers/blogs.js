const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  if (blogs) {
    response.json(blogs)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title) {
    return response.status(400).json({ error: 'title is missing' })
  }

  if (!body.url) {
    return response.status(400).json({ error: 'url is missing' })
  }

  if (!body.likes) {
    body.likes = 0
  }

  const blog = new Blog(body)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

module.exports = blogsRouter