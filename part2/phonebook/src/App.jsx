import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import personService from './person'
import Notification from './components/Notification'
import { useState, useEffect } from 'react'

const App = () => {
  const [dataUsers, setDataUsers] = useState([])
  const [newNumber, setNewNumber] = useState('')
  const [newName, setNewName] = useState('')
  const [filter, setFilter] = useState('')
  const [messageError, setMessageError] = useState('')
  const [messageSuccess, setMessageSuccess] = useState('')

  useEffect(() => {
    personService.getAll().then(response => {
      setDataUsers(response.data)
    })
  }, [])

  return (
    <>
      <h2>Phonebook</h2>
      <Notification messageError={messageError} messageSuccess={messageSuccess} />
      <Filter filter={filter} setFilter={setFilter} dataUsers={dataUsers} setDataUsers={setDataUsers} />

      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        dataUsers={dataUsers}
        setDataUsers={setDataUsers}
        setMessageError={setMessageError}
        setMessageSuccess={setMessageSuccess}
      />

      <h2>Numbers</h2>
      <Persons dataUsers={dataUsers} setDataUsers={setDataUsers} setMessageError={setMessageError} setMessageSuccess={setMessageSuccess} />
    </>
  )
}

export default App
