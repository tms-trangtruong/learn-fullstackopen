import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [currency, setCurrency] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [search, setSearch] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])

  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

  useEffect(() => {
    axios.get(`${baseUrl}/all`).then(response => {
      setCountries(response.data)
      setFilteredCountries(response.data)
    }).catch(error => {
      alert('Error fetching countries')
    })
  }, [])

  useEffect(() => {
    if (currency) {
      axios.get(`${baseUrl}/name/${currency}`).then(response => {
        setSelectedCountry(response.data)
      }).catch(error => {
        alert('Error fetching countries')
      })
    }
  }, [currency])

  const handleChange = (event) => {
    setCurrency('')
    setSelectedCountry(null)
    if (event.target.value.length) {
      setSearch(event.target.value)
      setFilteredCountries(countries.filter(country => country.name.common.toLowerCase().includes(event.target.value.toLowerCase())))
    } else {
      setFilteredCountries(countries)
      setSearch('')
    }
  }

  return (
    <>
      find countries <input value={search} onChange={handleChange} />

      <ul>
        {filteredCountries.map(country => (
          <li key={country.name.common} style={{ marginBottom: '10px' }} >
            <div style={{ display: 'flex', gap: '10px' }}>
              <span>{country.name.common}</span>
              <button onClick={() => setCurrency(country.name.common)}>show</button>
            </div>

            {
              selectedCountry?.name?.common === country.name.common && (
                <div style={{ padding: '10px' }}>
                  <img src={country.flags.png} alt={country.name.common} />
                </div>
              )
            }
            <div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
