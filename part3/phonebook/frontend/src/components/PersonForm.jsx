import personService from '../person'

const PersonForm = ({ newName, setNewName, newNumber, setNewNumber, dataUsers, setDataUsers, setMessageError, setMessageSuccess }) => {
  const addName = (event) => {
    event.preventDefault()
    if (newName === '' || newNumber === '') {
      setMessage('Name and number are required')
      return
    }
    const findSameName = dataUsers.find(user => user.name === newName)

    if (findSameName) {
      const updatedPerson = { name: newName, number: newNumber }
      personService.updatePerson(findSameName.id, updatedPerson).then(res => {
        setDataUsers(dataUsers.map(user => user.id === findSameName.id ? res.data : user))
        setNewName('')
        setNewNumber('')
        setMessageSuccess(`${newName} updated`)
        setTimeout(() => {
          setMessageSuccess('')
        }, 5000)
      }).catch((err) => {
        setMessageError(`Error updating person: ${err}`)
        setTimeout(() => {
          setMessageError('')
        }, 5000)
      })
    } else {
      personService.createPerson({ name: newName, number: newNumber }).then(res => {
        setDataUsers(dataUsers.concat(res.data))
        setNewName('')
        setNewNumber('')
        setMessageSuccess(`${newName} added`)
        setTimeout(() => {
          setMessageSuccess('')
        }, 5000)
      }).catch((err) => {
        setMessageError(`Error adding person: ${err}`)
        setTimeout(() => {
          setMessageError('')
        }, 5000)
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <form onSubmit={addName}>
      <div>name: <input value={newName} onChange={handleNameChange} /></div>
      <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm
