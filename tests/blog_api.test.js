const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  try {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  } catch (error) {
    console.error('Error inserting blogs:', error)
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog post has id property', async () => {
  const blogs = await helper.blogsInDb()
  const firstBlog = blogs[0]
  expect(firstBlog.id).toBeDefined()
})

afterAll(async () => {
  await mongoose.connection.close()
})