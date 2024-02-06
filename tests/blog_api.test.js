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

test('creating a new blog post works', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://testblog.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  expect(titles).toContain('Test Blog')
})

test('missing likes property defaults to 0', async () => {
  const newBlogWithoutLikes = {
    title: 'Test Blog Without Likes',
    author: 'Test Author Without Likes',
    url: 'https://testblogwithoutlikes.com'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(0)
})

afterAll(async () => {
  await mongoose.connection.close()
})