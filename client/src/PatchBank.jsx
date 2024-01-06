import { useState } from 'react'
import Patch from './Patch'

function PatchBank({ patchList, setPatchList, setLoadedPatch, setNodes, user, bankType, updateNodesRef }) {

    function toggleInput(e) {
        setShowInput(show => !show)
    }

    function addNewPatch(e) {
        e.preventDefault()

        const newPatch = {
            "name": "new patch",
            "creator": user,
            "creator_id": user.id,
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

        fetch("http://localhost:5000/patches", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newPatch)
        })
        .then(res => res.json())
        .then(data => {
            setLoadedPatch(data)
            setPatchList([...patchList, newPatch])
        })
    }

    return (
        <div class="patch-bank">
            <h2>{bankType} patches</h2>
            {!user && bankType == "user" && <p>log in or sign up to save patches</p>}
            {patchList.map(patch => {
                return <Patch
                    key={patch.id}
                    patch={patch}
                    setNodes={setNodes}
                    setLoadedPatch={setLoadedPatch}
                    updateNodesRef={updateNodesRef}
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