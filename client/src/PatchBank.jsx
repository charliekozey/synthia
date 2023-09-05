import React from 'react'

function PatchBank({patchList, setLoadedPatch}) {
  return (
    <div>
        {patchList.map(patch => {
            return <div key={patch.id} onClick={e => setLoadedPatch(patch)}>{patch.name}</div>
        })}
    </div>
  )
}

export default PatchBank