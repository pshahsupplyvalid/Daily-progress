import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  let [counter, setCounter] = useState(15)

  const addValue = () => {
    if (counter < 21) {        
      setCounter(counter + 1)
    }
  }

  const removeValue = () => {
    if (counter > 0) {         
      setCounter(counter - 1)
    }
  }

  return (
    <>
      <h1>Chai aur React</h1>
      <h2>Counter value: {counter}</h2>

      <button onClick={addValue}>Add Value +</button>
      <br />
      <button onClick={removeValue}>Remove Value -</button>
    </>
  )
}

export default App
