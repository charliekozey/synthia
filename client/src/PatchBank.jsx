import { useState } from 'react'
import Patch from './Patch'

function PatchBank({ patchList, setPatchList, setLoadedPatch, setNodes, user, bankType }) {

    console.log(bankType)

    function toggleInput(e) {
        setShowInput(show => !show)
    }

    function addNewPatch(e) {
        e.preventDefault()

        const newPatch = {
            "name": "new patch",
            "creator": user,
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

        fetch("http://localhost:4000/patches", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newPatch)
        })

        setLoadedPatch(newPatch)

        console.log(patchList)
        setPatchList([...patchList, newPatch])
    }

    return (
        <div>
            {patchList.map(patch => {
                return <Patch
                    key={patch.id}
                    patch={patch}
                    setNodes={setNodes}
                    setLoadedPatch={setLoadedPatch}
                />
            })}
            {
                bankType === "user" &&
                <button onClick={addNewPatch}>+</button>
            }
        </div>
    )
}

export default PatchBank