import { useEffect, useState, useRef } from 'react'
import Header from './Header'
import PatchBank from './PatchBank'
import OscillatorContainer from './OscillatorContainer'
import './App.css'

function App() {
  const [oscillators, setOscillators] = useState([])
  const nodesRef = useRef([])
  const [userPatchList, setUserPatchList] = useState([])
  const [globalPatchList, setGlobalPatchList] = useState([])
  const [loadedPatch, setLoadedPatch] = useState()
  const [user, setUser] = useState(null)
  const audioContext = new AudioContext()
  const keyboard = useRef({
    "a": { freq: 262, down: false },
    "w": { freq: 277, down: false },
    "s": { freq: 294, down: false },
    "e": { freq: 311, down: false },
    "d": { freq: 330, down: false },
    "f": { freq: 349, down: false },
    "t": { freq: 370, down: false },
    "g": { freq: 392, down: false },
    "y": { freq: 415, down: false },
    "h": { freq: 440, down: false },
    "u": { freq: 466, down: false },
    "j": { freq: 494, down: false },
    "k": { freq: 523, down: false },
    "o": { freq: 554, down: false },
    "l": { freq: 587, down: false },
    "p": { freq: 622, down: false },
    ";": { freq: 659, down: false },
    "'": { freq: 698, down: false },
  })
  const ref = useRef(null)
  const API_URL = import.meta.env.VITE_API_URL

  console.log(audioContext.baseLatency)

  // check session and load global patches
  useEffect(() => {
    // On page load, focus div with keyup/keydown listeners attached
    ref.current.focus()

    fetch(`${API_URL}/check_session`, {credentials: "include"})
      .then(res => {
        if (res.ok) {
          res.json()
          .then(user => {
            console.log("CHECK SESSION:", user)
            setUser(user)
            setLoadedPatch(user.patches[0])
          })
        }
      })
      // .then(res => res.json())
      // .then(data => console.log(data))
      // .catch(err => {
      //   console.log(err)
      // })
      
    fetch(`${API_URL}/patches`)
      .then(res => res.json())
      .then(data => {
        setGlobalPatchList(data)
        setLoadedPatch(data[0])
      })
  }, [])

  // load user patches
  useEffect(() => {
    // Any time user changes, get user's patch list and set loaded patch to user's first patch.
    // (If there is a user in state.)
    if (user) {
      setUserPatchList(user.patches)
      setLoadedPatch(user.patches[0])
    } else {
      setUserPatchList([])
    }
    // console.log("user changed")

  }, [user])

  function handleKeyDown(e) {
    if (Object.keys(keyboard.current).includes(e.key)) startSound(e)
    if (e.key === "Escape") panic(e)
    if (e.key === "z") octaveDown(e)
    if (e.key === "x") octaveUp(e)
  }

  function handleKeyUp(e) {
    if (Object.keys(keyboard.current).includes(e.key)) stopSound(e)
  }

  function updateNodesRef(updatedNodes) {
    nodesRef.current = updatedNodes
  }

  function startSound(e) {
    if (e.repeat) return
    const input = e.key

    if (!!loadedPatch && !keyboard.current[input].down) {
      // console.log("starting sound")
      loadedPatch.oscillators.forEach(osc => {
        // const sampleRate = audioContext.sampleRate
        // const duration = 1.0
        // const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate)
        // const channelData = buffer.getChannelData(0)
        const attackTime = parseFloat(logifyValue(osc.attack)) * 0.1
        // console.log(osc.number + " activating")
        // const oscNode = new OscillatorNode(audioContext, { type: osc.osc_type, frequency: keyboard.current[input].freq })
        const gainNode = new GainNode(audioContext, { gain: parseFloat(osc.gain) })
        
        let oscNode
        if (osc.number === 1) {
          oscNode = new OscillatorNode(audioContext, { type: osc.osc_type, frequency: keyboard.current[input].freq * 0.996 })
        } else if (osc.number === 2) {
          oscNode = new OscillatorNode(audioContext, { type: osc.osc_type, frequency: keyboard.current[input].freq })
        } else if (osc.number === 3) {
          oscNode = new OscillatorNode(audioContext, { type: osc.osc_type, frequency: keyboard.current[input].freq * 1.004 })
        }

        const newNode = {
          osc_node: oscNode,
          gain_node: gainNode,
          key_pressed: input,
          osc_data: osc
        }


        // for (let i = 0; i < buffer.length; i++) {
        //   channelData[i] = Math.sin((i / sampleRate) * 2 * Math.PI * 440); // Generate a 440Hz sine wave
        // }

        // oscNode.buffer = buffer
        oscNode.connect(gainNode)
        gainNode.gain.setValueAtTime(0.0000000001, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(parseFloat(osc.gain) * 0.1, audioContext.currentTime + attackTime)
        gainNode.connect(audioContext.destination)
        oscNode.start()

        // console.log("adding new node")
        // console.log(nodesRef.current)
        nodesRef.current = [...nodesRef.current, newNode]
      })

      keyboard.current[input].down = true
    }
  }

  function stopSound(e) {

    const input = e.key 
    // console.log("key down?", keyboard.current[input].down)

    if (Object.keys(keyboard.current).includes(input)) {
      // console.log("stopping sound")

      nodesRef.current.forEach(node => {
        const releaseTime = logifyValue(node.osc_data.release)

        if (node.key_pressed == input) {
          node.gain_node.gain.setValueAtTime(node.gain_node.gain.value, audioContext.currentTime)
          // node.gain_node.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.05)
          node.gain_node.gain.exponentialRampToValueAtTime(0.0000000001, audioContext.currentTime + parseFloat(releaseTime))

          setTimeout(() => {
            node.gain_node.disconnect()
            node.osc_node.disconnect()
          }, 5000)
        }
      })
      keyboard.current[input].down = false
    }
    // setTimeout(() => {
    //     nodesRef.current = []
    // }, 1000)

  }

  function octaveDown(e) {
    if (keyboard.current["a"].freq > 66) {
      for (const note in keyboard.current) {
          keyboard.current[note].freq /= 2
      }
    }
  }

  function octaveUp(e) {
    if (keyboard.current["a"].freq < 1048) {
      for (const note in keyboard.current) {
          keyboard.current[note].freq *= 2
      }
    }
  }

  function panic(e) {
    nodesRef.current.forEach(node => {
      // console.log("stopping node")
      node.gain_node.gain.setValueAtTime(node.gain_node.gain.value, audioContext.currentTime)
      node.gain_node.gain.linearRampToValueAtTime(0.00001, audioContext.currentTime + 0.002)

      setTimeout(() => {
        node.gain_node.disconnect()
        node.osc_node.disconnect()
      }, 51)
    })
  }

  function updateGain(e, gainToUpdate, oscId) {
    // const saveStatus = document.getElementById("save-status")
    // saveStatus.style.display = "block"
    // console.log(oscId)
    // console.log("updating gain")
    // console.log(e)
    gainToUpdate = parseFloat(e.target.value)
    // console.log(gainToUpdate)

    fetch(`${API_URL}/oscillators/${oscId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ gain: gainToUpdate })
    })
      // .then(res => res.json())
      // .then(data => console.log(data.message))
  }

  function logifyValue(position) {
    const minInput = 0
    const maxInput = 100

    const minValue = Math.log(1)
    const maxValue = Math.log(100000000000000000000)

    const scale = (maxInput - minInput) / (maxValue - minValue)

    return Math.exp(minValue + scale * (position - minInput))
  }

  // console.log("logifyValue(0.0) = ", logifyValue(0.0))
  // console.log("logifyValue(0.1) = ", logifyValue(0.1))
  // console.log("logifyValue(0.2) = ", logifyValue(0.2))
  // console.log("logifyValue(0.3) = ", logifyValue(0.3))
  // console.log("logifyValue(0.4) = ", logifyValue(0.4))
  // console.log("logifyValue(0.5) = ", logifyValue(0.5))
  // console.log("logifyValue(0.6) = ", logifyValue(0.6))
  // console.log("logifyValue(0.7) = ", logifyValue(0.7))
  // console.log("logifyValue(0.8) = ", logifyValue(0.8))
  // console.log("logifyValue(0.9) = ", logifyValue(0.9))
  // console.log("logifyValue(1.0) = ", logifyValue(1.0))

  return (
    <div id="main" ref={ref} tabIndex={0} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
      <Header user={user} setUser={setUser} API_URL={API_URL} />
      {loadedPatch &&
        <OscillatorContainer
          loadedPatch={loadedPatch}
          setLoadedPatch={setLoadedPatch}
          userPatchList={userPatchList}
          setUserPatchList={setUserPatchList}
          globalPatchList={globalPatchList}
          setGlobalPatchList={setGlobalPatchList}
          API_URL={API_URL}
        />}

      <div id="patch-container">
      <PatchBank
          patchList={globalPatchList}
          setPatchList={setGlobalPatchList}
          setLoadedPatch={setLoadedPatch}
          updateNodesRef={updateNodesRef}
          // setNodes={setNodes}
          bankType="global"
          API_URL={API_URL}
        />
        {
          user ?
          <>
            <PatchBank
              patchList={userPatchList}
              setPatchList={setUserPatchList}
              setLoadedPatch={setLoadedPatch}
              updateNodesRef={updateNodesRef}
              nodesRef={nodesRef}
              // setNodes={setNodes}
              user={user}
              bankType="user"
              API_URL={API_URL}
            />
          </>
          :
          <div>
            <h2>user patches</h2>
            <p>
              log in to save your own patches!
            </p>
          </div>
        } 
      </div>
    </div>
  )
}

export default App