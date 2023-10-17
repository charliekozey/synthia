import React from 'react'

function Patch({ patch, setLoadedPatch, updateNodesRef }) {
    
    function handleClick() {
        updateNodesRef([])
        setLoadedPatch(patch)
    }
    
    return (
        <div className="patch-card" onClick={handleClick}>
            { patch && patch.creator ? 
            <span>
                <span>{patch.name} | </span>   
                <span className="patch-info">
                    <em>by {patch.creator.name} </em> 
                    {patch.favorites && <span> | ⭐️ {patch.favorites.length}</span>}
                </span>
            </span>
            :
            null
            }
        </div>
    )
}

export default Patch