const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token
let testUser

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('testpass', 10)
  testUser = await new User({ username: 'testuser', name: 'Test User', passwordHash }).save()

  const blogsWithUser = initialBlogs.map(b => ({ ...b, user: testUser._id }))
  await Blog.insertMany(blogsWithUser)

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'testpass' })

  token = loginResponse.body.token
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blogs have id property instead of _id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  assert.ok(blog.id)
  assert.strictEqual(blog._id, undefined)
})

test('a valid blog can be added with token', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://test.com',
    likes: 3,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length + 1)

  const titles = response.body.map(b => b.title)
  assert(titles.includes(newBlog.title))
})

test('adding a blog fails with 401 if token is not provided', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://test.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blog without likes defaults to 0', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://test.com',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title or url returns 400', async () => {
  const newBlog = {
    author: 'Test Author',
    url: 'https://test.com',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('blog without url returns 400', async () => {
  const newBlog = {
    title: 'Missing URL blog',
    author: 'Test Author',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

describe('deletion of a blog', () => {
  test('succeeds with status 204 if id is valid and user is creator', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)

    const titles = blogsAtEnd.body.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))
  })
})

describe('updating a blog', () => {
  test('succeeds updating likes', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedData = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
