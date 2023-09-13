import { useState } from 'react'

function PatchBank({patchList, setPatchList, loadedPatch}) {
    const [showInput, setShowInput] = useState(false)
    const [inputValue, setInputValue] = useState("")

    function toggleInput(e) {
        setShowInput(show => !show)
    }

    function addNewPatch(e) {
        e.preventDefault()

        const newPatch = {
                            "name": inputValue,
                            "oscillators": [
                                {
                                    "attack": 0.2,
                                    "decay": 0.2,
                                    "gain": 0.2,
                                    "number": 1,
                                    "osc_type": "sine",
                                    "release": 0.2,
                                    "sustain": 0.2
                                },
                                {
                                    "attack": 0.2,
                                    "decay": 0.2,
                                    "gain": 0.2,
                                    "number": 2,
                                    "osc_type": "sine",
                                    "release": 0.2,
                                    "sustain": 0.2
                                },
                                {
                                    "attack": 0.2,
                                    "decay": 0.2,
                                    "gain": 0.2,
                                    "number": 3,
                                    "osc_type": "sine",
                                    "release": 0.2,
                                    "sustain": 0.2
                                }
                            ]
                        }
                        
        setInputValue("")
        loadedPatch.current = newPatch

        console.log(patchList)
        setPatchList([...patchList, newPatch])
    }

  return (
    <div>
        {patchList.map(patch => {
            return <div key={patch.id} onClick={e => loadedPatch.current = patch}>{patch.name}</div>
        })}
        <button onClick={e => toggleInput(e)}>{showInput ? "cancel" : "+"}</button>
        {showInput ? 
            <form onSubmit={e => addNewPatch(e)}>
                <input 
                    type="text"
                    name="new-patch-name"
                    placeholder="name your new patch"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                ></input>
                <button type="submit">create new patch</button>
            </form>
        : 
            <></>
        }
    </div>
  )
}

export default PatchBank