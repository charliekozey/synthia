import { useState } from 'react'

function Oscillator({ osc, loadedPatch, setLoadedPatch, setIsModified }) {
    const [oscValues, setOscValues] = useState({
        osc_type: osc.osc_type,
        gain: osc.gain,
        attack: osc.attack,
        release: osc.release,
        number: osc.number,
        id: osc.id
    })

    function updateOscValue(e) {
        const updatedOscArray = loadedPatch.oscillators.map(o => {
            if (o.number === osc.number) {
                o[e.target.name] = e.target.value
                // console.log("name", e.target.name)
                // console.log("value", e.target.value)
            }
            return o
        })
        // console.log(updatedOscArray)
        setLoadedPatch({
            ...loadedPatch,
            oscillators: updatedOscArray
        })
        const { name, value } = e.target
        setOscValues({ ...oscValues, [name]: value })
        setIsModified(true)
    }

    return (
        <>
            <em>
                <h3 id="osc-name">Osc {osc.number}</h3>
            </em>

            <label htmlFor={`osc_type`}>wave:</label>
            <select 
                id={`osc_type`} 
                name={`osc_type`}
                onChange={e => updateOscValue(e)}
                value={oscValues.osc_type}
            >
                <option value="sine">sine</option>
                <option value="triangle">triangle</option>
                <option value="sawtooth">sawtooth</option>
                <option value="square">square</option>
            </select>

            <label htmlFor="gain">gain:</label>
            <input
                name="gain"
                type="range"
                min={0.001}
                max={1}
                step={0.01}
                value={oscValues.gain}
                onChange={e => updateOscValue(e)}
            ></input>

            <label htmlFor="attack">attack:</label>
            <input
                name="attack"
                type="range"
                min={0.001}
                max={1}
                step={0.01}
                value={oscValues.attack}
                onChange={e => updateOscValue(e)}
            ></input>

            <label htmlFor="release">release:</label>
            <input
                name="release"
                type="range"
                min={0.001}
                max={1}
                step={0.01}
                value={oscValues.release}
                onChange={e => updateOscValue(e)}
            ></input>

        </>
    )
}

export default Oscillator