import axios from 'axios'

const baseUrl = 'https://learn-fullstackopen-d6mq.onrender.com/api/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const createPerson = (newObject) => {
  return axios.post(baseUrl, newObject)
}

const updatePerson = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, createPerson, updatePerson, deletePerson }
