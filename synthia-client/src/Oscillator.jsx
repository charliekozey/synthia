import { useState } from 'react'

function Oscillator({ type }) {
  const [gain, setGain] = useState(0.5)
  function changeGain(e) {
    setGain(parseFloat(e.target.value))
  }

  return (
    <>
        <h3>{type}</h3>
        <label htmlFor="gain-slider">gain:</label>
        <input type="range" value="0.5" min="0" max="1" step="0.01" onChange={changeGain}></input>
    </>
  )
}

export default Oscillator