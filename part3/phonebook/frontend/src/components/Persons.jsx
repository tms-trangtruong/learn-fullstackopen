import Note from './Note'
import personService from '../person'

const Persons = ({ dataUsers, setDataUsers, setMessageError, setMessageSuccess }) => {
  const handleDelete = (id) => {
    personService.deletePerson(id).then(() => {
      setDataUsers(dataUsers.filter(user => user.id !== id))
      setMessageSuccess('Person deleted')
      setTimeout(() => {
        setMessageSuccess('')
      }, 5000)
    }).catch((err) => {
      if (err.status === 404) {
        setMessageError(`${dataUsers.find(user => user.id === id).name} has already been removed from server`)
      } else {
        setMessageError('Error deleting person: ' + err.response.data.error)
      }
      setTimeout(() => {
        setMessageError('')
      }, 5000)
    })
  }

  return (
    <ul>
      {dataUsers.map((user) =>
        <Note key={user.name} content={`${user.name} ${user.number}`} onDelete={() => handleDelete(user.id)} />
      )}
    </ul>
  )
}

export default Persons
