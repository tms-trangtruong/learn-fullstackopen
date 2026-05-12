const Filter = ({ filter, setFilter, dataUsers, setDataUsers }) => {
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setDataUsers(dataUsers.filter(user => user.name.toLowerCase().includes(filter.toLowerCase())))
  }

  return (
    <p>Filter shown with <input value={filter} onChange={handleFilterChange} /></p>
  )
}

export default Filter
