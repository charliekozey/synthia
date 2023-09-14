import React from 'react'

function Patch({ patch, setNodes, setLoadedPatch }) {
    
    function handleClick() {
        setNodes([])
        setLoadedPatch(patch)
    }
    
    return (
        <div className="patch-card" onClick={handleClick}>
            <span>{patch.name} | </span>
            <span className="patch-info"><em>by {patch.creator.name} </em> | ⭐️ {Math.ceil(Math.random() * 100)}</span>
        </div>
    )
}

export default Patch