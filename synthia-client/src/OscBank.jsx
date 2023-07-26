import React from 'react'
import Oscillator from './Oscillator'

function OscBank({oscillators, setOscillators}) {
  
    const oscillatorList = oscillators.map(osc => {
        return <Oscillator osc={osc} oscillators={oscillators} setOscillators={setOscillators} />
    })
    
  return (
    <div id="osc-bank">
        {oscillatorList}
        <h3>then use home row keys (the asdf row) to play</h3>
    </div>
  )
}

export default OscBank