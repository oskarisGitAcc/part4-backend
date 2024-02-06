const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const mostLikedBlog = blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max
  }, blogs[0])

  return {
    title: mostLikedBlog.title,
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogCounts = _.countBy(blogs, 'author')

  const topAuthor = _.maxBy(Object.keys(blogCounts), (author) => blogCounts[author])

  return {
    author: topAuthor,
    blogs: blogCounts[topAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogLikes = _.orderBy(blogs, 'likes', 'desc')

  return {
    author: blogLikes[0].author,
    likes: blogLikes[0].likes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}