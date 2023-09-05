import { useState } from 'react'

function Oscillator({ osc }) {
    const [sliderValues, setSliderValues] = useState({
        gain: osc.gain, 
        attack: osc.attack, 
        release: osc.release
    })
    
    function updateSliderValue(e) {
        const {name, value} = e.target
        setSliderValues({...sliderValues, [name]: value})

        fetch(`http://localhost:4000/oscillators/${osc.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({[name]: value})
        })
            .then(res => res.json())
            .then(data => console.log(data.message))
    }
    
    return (
        <>
            <em>
                <h3 id="osc-name">Osc {osc.number}</h3>
            </em>

            <label htmlFor={`type-select-${osc.number}`}>wave:</label>
            <select id={`type-select-${osc.number}`} name={`type-${osc.number}`}>
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
                value={sliderValues.gain} 
                onChange={e => updateSliderValue(e)}
            ></input>

            <label htmlFor="attack">attack:</label>
            <input 
                name="attack" 
                type="range" 
                min={0.001} 
                max ={1} 
                step={0.01} 
                value={sliderValues.attack} 
                onChange={e => updateSliderValue(e)}
            ></input>

            <label htmlFor="release">release:</label>
            <input 
                name="release" 
                type="range" 
                min={0.001} 
                max ={1} 
                step={0.01} 
                value={sliderValues.release} 
                onChange={e => updateSliderValue(e)}
            ></input>
        </>
    )
}

export default Oscillator