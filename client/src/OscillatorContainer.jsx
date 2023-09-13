import { useState } from 'react'
import Oscillator from './Oscillator'

function OscillatorContainer({ loadedPatch }) {
    const oscList = loadedPatch.current.oscillators.map(osc => {
        return <Oscillator
            key={osc.id}
            osc={osc}
            loadedPatch={loadedPatch}
        />
    })

    function savePatchSettings() {
        // user clicks save patch button
        // the slider values from each osc have been updating the loadedPatch in state
        // when this function runs, we set the new patches and the backend updates

        // fetch(`http://localhost:4000/oscillators/${osc.id}`, {
        //     method: "PATCH",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Accept": "application/json",
        //     },
        //     body: JSON.stringify(sliderValues)
        // })
        //     .then(res => res.json())
        //     .then(data => console.log(data.message))
    }


    return (
        <>
            <h1>{loadedPatch.current.name}</h1>
            <button onClick={savePatchSettings}>save changes</button>
            {oscList.sort((a, b) => {
                return a.props.osc.number - b.props.osc.number
            })}

        </>
    )
}

export default OscillatorContainer