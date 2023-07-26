import React from 'react'

function OscGenerators({ oscillators, setOscillators }) {

    function generateOsc(e) {
        const newOsc = {
            type: e.target.id,
            gain: 0.5
        }
        setOscillators([...oscillators, newOsc])
        console.log(oscillators)
    }

    return (
        <div id="osc-generators">
            <h3>first, add at least one oscillator:</h3>
            <button onClick={generateOsc} id="sine">+ sine</button>
            <button onClick={generateOsc} id="square">+ square</button>
            <button onClick={generateOsc} id="sawtooth">+ saw</button>
            <button onClick={generateOsc} id="triangle">+ triangle</button>
            <button onClick={generateOsc} id="custom">+ custom</button>
        </div>
    )
}

export default OscGenerators