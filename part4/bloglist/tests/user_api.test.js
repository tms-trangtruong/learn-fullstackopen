const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Root User', passwordHash })
  await user.save()
})

describe('POST /api/users', () => {
  test('succeeds with valid data', async () => {
    const usersAtStart = await User.find({})

    const newUser = { username: 'newuser', name: 'New User', password: 'password123' }
    await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('fails with 400 if username missing', async () => {
    const newUser = { name: 'No Username', password: 'password123' }
    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.includes('username'))
  })

  test('fails with 400 if username too short', async () => {
    const newUser = { username: 'ab', name: 'Short', password: 'password123' }
    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.includes('username'))
  })

  test('fails with 400 if password missing', async () => {
    const newUser = { username: 'validuser', name: 'No Password' }
    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.includes('password'))
  })

  test('fails with 400 if password too short', async () => {
    const newUser = { username: 'validuser', name: 'Short Pass', password: 'ab' }
    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.includes('password'))
  })

  test('fails with 400 if username already taken', async () => {
    const newUser = { username: 'root', name: 'Duplicate', password: 'password123' }
    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.includes('unique'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
