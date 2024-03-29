const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: '65d4b1c59ce67809099f3614',
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: '65d4b2449ce67809099f361a',
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: '65d4b1c59ce67809099f3614',
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    user: '65d4b1c59ce67809099f3614',
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    user: '65d4b2449ce67809099f361a',
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: '65d4b1c59ce67809099f3614',
    __v: 0
  }
]

const initialUsers = [
  {
    _id: '65d4b1c59ce67809099f3614',
    username: 'root',
    name: 'Superuser',
    password: 'salainen',
    __v: 0
  },
  {
    _id: '65d4b2449ce67809099f361a',
    username: 'pyykkoo1',
    name: 'Oskari',
    password: 'secrettt',
    __v: 0
  },
]

const nonExistingBlogId = async () => {
  const blog = new Blog({
    title: 'Test Blog Without Likes',
    author: 'Test Author Without Likes',
    url: 'https://testblogwithoutlikes.com'
  })
  await blog.save()
  const deletedBlog = await Blog.findByIdAndDelete(blog._id)

  return deletedBlog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  nonExistingBlogId,
  blogsInDb,
  usersInDb
}