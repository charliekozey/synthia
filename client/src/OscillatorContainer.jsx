import { useState } from 'react'
import Oscillator from './Oscillator'

function OscillatorContainer({ loadedPatch, setLoadedPatch,  userPatchList, setUserPatchList, globalPatchList, setGlobalPatchList, API_URL }) {
    const [isModified, setIsModified] = useState(false)
    const [editName, setEditName] = useState(false)
    const [newName, setNewName] = useState("")

    const oscList = loadedPatch.oscillators.map(osc => {
        return <Oscillator
            key={osc.id}
            osc={osc}
            loadedPatch={loadedPatch}
            setLoadedPatch={setLoadedPatch}
            setIsModified={setIsModified}
        />
    })

    function savePatchSettings() {
        setIsModified(false)
        // user clicks save patch button
        // the slider values from each osc have been updating the loadedPatch in state
        // when this function runs, we set the new patches and the backend updates

        fetch(`${API_URL}/patches/${loadedPatch.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(loadedPatch)
        })
            // .then(res => res.json())
            // .then(data => console.log(data.message))
    }
        
    function savePatchName(e) {
        e.preventDefault()

        const updatedUserPatchList = userPatchList.map(patch => {
            if (patch.id === loadedPatch.id) {
                return ({...loadedPatch, name: newName})
            } else {
                return patch
            }
        })

        const updatedGlobalPatchList = globalPatchList.map(patch => {
            if (patch.id === loadedPatch.id) {
                return ({...loadedPatch, name: newName})
            } else {
                return patch
            }
        })
        
        fetch(`${API_URL}/patches/${loadedPatch.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({...loadedPatch, name: newName})
        })
        // .then(res => res.json())
        // .then(data => console.log(data.message))
        
        setEditName(false)
        setLoadedPatch({...loadedPatch, name: newName})
        setNewName("")
        setUserPatchList(updatedUserPatchList)
        setGlobalPatchList(updatedGlobalPatchList)
    }

    function cancelEditName() {
        setEditName(false)
        setNewName("")
    }


    return (
        <div id="oscillator-container">
            {
                editName ?
                    <>
                        <form onSubmit={savePatchName}>
                            <input 
                                type="text" 
                                placeholder="new patch name"
                                onChange={e => setNewName(e.target.value)}
                                value={newName}
                            >
                            </input>
                            <input type="submit" value="save"></input>
                        </form>
                        <button onClick={cancelEditName}>cancel editing</button>
                    </>
                :
                    <>
                        <span>{loadedPatch.name}</span>
                    </>
            }
            {
                isModified ?
                <>
                    <span>(modified)</span>  
                    <button onClick={savePatchSettings}>save changes</button> 
                </>
                : 
                <></>
            }
            <span><button onClick={() => setEditName(true)}>edit name</button></span>
            <div id="osc-flexbox">

                {oscList.sort((a, b) => {
                    return a.props.osc.number - b.props.osc.number
                })}
                
            </div>
        </div>
    )
}

export default OscillatorContainer