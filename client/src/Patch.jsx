import React from 'react'

function Patch({ patch, setLoadedPatch, updateNodesRef }) {
    
    function handleClick() {
        updateNodesRef([])
        setLoadedPatch(patch)
    }

    // console.log(patch)
    
    return (
        <div className="patch-card" onClick={handleClick}>
            <span>{patch.name} | </span>
            <span className="patch-info">
                <em>by {patch.creator.name} </em> 
                {patch.favorited_by && <span> | ⭐️ {patch.favorited_by.length}</span>}
            </span>
        </div>
    )
}

export default Patch