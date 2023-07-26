import { useEffect, useState } from 'react'

function Oscillator({oscillators, setOscillators, osc}) {
  const [updatedOsc, setUpdatedOsc] = useState(osc)

  function updateOsc(e) {
    const newArray = oscillators.map(oscillator => {
      if (oscillator.name == osc.name) {
        return {
          ...oscillator,
          [e.target.name]: e.target.value
        }
      } else {
        return oscillator
      }
    })
    setOscillators(newArray)
    setUpdatedOsc({
      ...updatedOsc,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
        <h3>Osc {osc.name}</h3>
        <label htmlFor="type">wave:</label>
        <select name="type" value={updatedOsc.type} min="0" max="1" step="0.01" onChange={updateOsc}>
          <option value="sine">sine</option>
          <option value="triangle">triangle</option>
          <option value="sawtooth">sawtooth</option>
          <option value="square">square</option>
        </select>
        <label htmlFor="gain-slider">gain:</label>
        <input name="gain" value={updatedOsc.gain} type="range" min="0" max="1" step="0.01" onChange={updateOsc}></input>
    </>
  )
}

export default Oscillator