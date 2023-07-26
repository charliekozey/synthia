import { useState } from 'react'

function Oscillator({oscillators, setOscillators, osc}) {
  const [gain, setGain] = useState(0.5)

  const updatedOsc = {
      type: osc.type,
      gain: gain
  }

  function changeGain(e) {
    setOscillators([...oscillators, updatedOsc])
  }

  return (
    <>
        <h3>{osc.type}</h3>
        <label htmlFor="gain-slider">gain:</label>
        <input type="range" value={osc.gain} min="0" max="1" step="0.01" onChange={changeGain}></input>
    </>
  )
}

export default Oscillator