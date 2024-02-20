const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

// token obtained by running login POST command via post_requests.rest
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY1ZDRiMWM1OWNlNjc4MDkwOTlmMzYxNCIsImlhdCI6MTcwODQ0OTA2MH0.fCO4uq4uqCnmkYLH404N-xZ7sled45nSK2cxXjqdczw'

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
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
    likes: 5,
    user: '65d4b1c59ce67809099f3614'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
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
    url: 'https://testblogwithoutlikes.com',
    user: '65d4b1c59ce67809099f3614'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(0)
})

test('missing title returns status code 400', async () => {
  const newBlog = {
    author: 'Test Author',
    url: 'https://testblog.com'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(newBlog)
    .expect(400)
})

test('missing url returns status code 400', async () => {
  const newBlog = {
    title: 'Test Title',
    author: 'Test Author',
    user: '65d4b1c59ce67809099f3614'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${authToken}`)
    .send(newBlog)
    .expect(400)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

  const titles = blogsAtEnd.map(r => r.title)
  expect(titles).not.toContain(blogToDelete.title)
})

test('deleting a non-existent blog returns status code 404', async () => {
  const nonExistentId = await helper.nonExistingBlogId()

  await api
    .delete(`/api/blogs/${nonExistentId}`)
    .expect(404)
})

test('updating a blog post', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)

  expect(updatedBlogInDb.likes).toBe(updatedBlog.likes)
})

afterAll(async () => {
  await mongoose.connection.close()
})