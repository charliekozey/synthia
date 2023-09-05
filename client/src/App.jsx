import { useEffect, useState } from 'react'
import PatchBank from './PatchBank'
import OscillatorContainer from './OscillatorContainer'
import './App.css'

function App() {
  const [oscillators, setOscillators] = useState([])
  const [nodes, setNodes] = useState([])
  const [patchList, setPatchList] = useState([])
  const [loadedPatch, setLoadedPatch] = useState()

  useEffect(() => {
    fetch("http://localhost:4000/patches")
    .then(res => res.json())
    .then(data => {
      setPatchList(data)
      setLoadedPatch(data[0])
    })
  }, [])

  return (
    <>
      <header>
          <h1>welcome to ~ s y n t h i a ~</h1>
      </header>
      <h2>
          use home row keys (the asdf row) to play
      </h2>
      <h2>
          press escape to stop all sound
      </h2>
      <PatchBank patchList={patchList} setPatchList={setPatchList} setLoadedPatch={setLoadedPatch} />
      {loadedPatch && <OscillatorContainer loadedPatch={loadedPatch} />}
    </>
  )
}

export default App
