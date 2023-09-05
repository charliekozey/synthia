import React from 'react'
import Oscillator from './Oscillator'

function OscillatorContainer({ loadedPatch }) {
    const oscList = loadedPatch.oscillators.map(osc => {
        console.log(osc.number)
        return <Oscillator key={osc.id} osc={osc} />
    })
   
        
    return (
        <>
            <h1>{loadedPatch.name}</h1>
            {oscList.sort((a, b) => {
                return a.props.osc.number - b.props.osc.number
            })}
        </>
    )
}

export default OscillatorContainer