const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

test('creating a new user post works', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'testuser',
    name: 'test',
    password: 'secret',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

  const usernames = usersAtEnd.map(user => user.username)
  expect(usernames).toContain(newUser.username)
})

test('creation fails with proper statuscode and message if username already taken', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'salainen'
  }
  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  expect(result.body.error).toContain('username must be unique.')
  expect(usersAtEnd).toHaveLength(usersAtStart.length)
})

test('creation fails with proper status code and message if username is shorter than 3 characters', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'us',
    name: 'Short Username',
    password: 'password'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  expect(result.body.error).toContain('username and password must be at least 3 characters long.')
  expect(usersAtEnd).toHaveLength(usersAtStart.length)
})

test('creation fails with proper status code and message if password is shorter than 3 characters', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'validusername',
    name: 'Short Password',
    password: 'pw'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  expect(result.body.error).toContain('username and password must be at least 3 characters long.')
  expect(usersAtEnd).toHaveLength(usersAtStart.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})