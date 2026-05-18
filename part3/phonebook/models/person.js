const mongoose = require('mongoose')
mongoose.set('strictQuery',false)
mongoose.connect(process.env.MONGODB_URI, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  number: {
    type: String,
    required: true,
    minlength: [8, 'Number must be at least 8 digits'],
    validate: {
      validator: function(v) {
        return /^\d{3}-\d{3}-\d{4}$/.test(v)
      },
      message: () => 'Number must be in the format 123-456-7890'
    }
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
