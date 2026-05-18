require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

morgan.token('type', function (req, res) { return JSON.stringify(req.body) })


app.get('/', (req, res) => {
  res.send('<h1>Hello World123</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  }).catch(error => {
    res.status(500).end()
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person.countDocuments().then(count => {
    res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next)=>{
  const id = req.params.id
  Person.findByIdAndDelete(id).then(() => {
    res.status(204).end()
  })
  .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name and number are required'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findById(req.params.id).then(person => {
    if (!person) {
      return res.status(404).end()
    }

    person.name = name
    person.number = number

    return person.save().then((updatedPerson) => {
      res.json(updatedPerson)
    })
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
