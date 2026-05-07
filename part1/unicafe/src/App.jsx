import { useState } from 'react'

const Header = ({title}) => {
  return (
    <h1>{title}</h1>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <tr><td style={{ textAlign: 'left' }}>{text}</td><td style={{ textAlign: 'right' }}>{value}</td></tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  return (
    <table style={{ width: '400px' }}>
      <tbody >
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={good + neutral + bad} />
        <StatisticLine text="average" value={((good * 1) + (neutral * 0) + (bad * -1)) / (good + neutral + bad) || 0} />
        <StatisticLine text="positive" value={`${good / (good + neutral + bad) * 100 || 0}%`} />
      </tbody>
    </table>
  )
}

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <Header title="give feedback" />
      <div>
        <Button onClick={() => setGood(good + 1)} text="good" />
        <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
        <Button onClick={() => setBad(bad + 1)} text="bad" />
      </div>

      <Header title="statistics" />

      {good + neutral + bad > 0 ? (
        <Statistics good={good} neutral={neutral} bad={bad} />
      ) : (
        <p>No feedback given</p>
      )}
    </>
  )
}

export default App
