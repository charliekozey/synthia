// function todo() {
// NOW DOING:
// GET user favorites


// TODO:
// add new patch
// social patch info
// user login
// remove unused gain node on note end
// waveform manipulation (asdr) for individual oscillators
// gain sliders not working right; i think there's an extra node hanging out somewhere
// fix: behavior differs between click+slide vs. click on gain sliders
// update gitignore
// fix static on gain slider change
// effects
// lfo
// EQ/filters
// beginner-friendly illustrations and self-guiding UI
// sequencer
// play more than 6 notes at a time?
// fix browser tab change bug (audio still plays)
// localize key map
// user profiles
// filter global patches by user
// filter patches by type (pad, bass, arp, etc)
// patch descriptions?
// patch tags

// REFACTOR: 
// abstract out updateGain/updateRelease/updateAttack etc functions

// IDEAS:
// target ed space? younger audience?
// display held down keys in visual representation (qwerty? piano? both?)
// calculate chord from held notes and display it
// incorporate sequencer, etc
// maybe similar target audience to hookpad?
// trackpad as xy manipulator for pitch, other params
// record output
// investigate beating
// ~ o s c i l l o s c o p e ~
// microtonality?
// stereo? spatial??
// arpeggiator
// import/export midi
// external controller support
// }

import { useEffect, useState, useRef } from 'react'
import Header from './Header'
import PatchBank from './PatchBank'
import OscillatorContainer from './OscillatorContainer'
import './App.css'

function App() {
  const [oscillators, setOscillators] = useState([])
  const [nodes, setNodes] = useState([])
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

  useEffect(() => {
    // On page load, focus div with keyup/keydown listeners attached
    ref.current.focus()

    fetch("http://localhost:4000/patches")
      .then(res => res.json())
      .then(data => {
        setGlobalPatchList(data)
        setLoadedPatch(data[0])
      })

    fetch("http://localhost:4000/users")
      .then(res => res.json())
      .then(data => {
        setUser(data[0])
      })
  }, [])

  useEffect(() => {
    // Any time user changes, get user's patch list and set loaded patch to user's first patch.
    // (If there is a user in state.)
    if (user) {
      setUserPatchList(user.patches)
      setLoadedPatch(user.patches[0])
    }

  }, [user])

  function handleKeyDown(e) {
    if (Object.keys(keyboard.current).includes(e.key)) startSound(e)
    if (e.key === "Escape") panic(e)
    if (e.key === "x" || e.key === "z") changeOctave(e)
  }

  function handleKeyUp(e) {
    if (Object.keys(keyboard.current).includes(e.key)) stopSound(e)
  }

  function startSound(e) {
    if (e.repeat) return
    const input = e.key

    if (!!loadedPatch && !keyboard.current[input].down) {
      console.log("starting sound")
      loadedPatch.oscillators.forEach(osc => {
        const attackTime = logifyValue(osc.attack)
        console.log(osc.number + " activating")
        const oscNode = new OscillatorNode(audioContext, { type: osc.osc_type, frequency: keyboard.current[input].freq })
        const gainNode = new GainNode(audioContext, { gain: parseFloat(osc.gain) })
        const typeSelect = document.getElementById(`type-select-${osc.number}`)
        const gainSlider = document.getElementById(`gain-slider-${osc.number}`)
        const releaseSlider = document.getElementById(`release-slider-${osc.number}`)
        const newNode = {
          osc_node: oscNode,
          gain_node: gainNode,
          key_pressed: input,
          osc_data: osc
        }

        oscNode.connect(gainNode)
        gainNode.gain.setValueAtTime(0.0000000001, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(parseFloat(osc.gain) * 0.1, audioContext.currentTime + parseFloat(attackTime) * 0.1)
        gainNode.connect(audioContext.destination)
        oscNode.start()

        console.log("adding new node")
        console.log(nodes)
        setNodes(nodes => [...nodes, newNode])
      })

      keyboard.current[input].down = true
    }
  }

  function stopSound(e) {

    const input = e.key
    console.log("key down?", keyboard.current[input].down)

    if (Object.keys(keyboard.current).includes(input)) {
      console.log("stopping sound")

      nodes.forEach(node => {
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
    //     setNodes(state => [])
    // }, 1000)

  }

  function changeOctave(e) {
    for (const note in keyboard.current) {
      if (e.key == "z") {
        keyboard.current[note].freq = keyboard.current[note].freq / 2
      }
      if (e.key == "x") {
        keyboard.current[note].freq = keyboard.current[note].freq * 2
      }
    }

  }

  function panic(e) {
    nodes.forEach(node => {
      console.log("stopping node")
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
    console.log(oscId)
    console.log("updating gain")
    console.log(e)
    gainToUpdate = parseFloat(e.target.value)
    console.log(gainToUpdate)

    fetch(`http://localhost:4000/oscillators/${oscId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ gain: gainToUpdate })
    })
      .then(res => res.json())
      .then(data => console.log(data.message))
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
      <Header user={user} />
      {loadedPatch &&
        <OscillatorContainer
          loadedPatch={loadedPatch}
          setLoadedPatch={setLoadedPatch}
        />}
      <h2>User Patches</h2>
      <PatchBank
        patchList={userPatchList}
        setPatchList={setUserPatchList}
        setLoadedPatch={setLoadedPatch}
        setNodes={setNodes}
        user={user}
        bankType="user"
      />
      <h2>Global Patches</h2>
      <PatchBank
        patchList={globalPatchList}
        setPatchList={setGlobalPatchList}
        setLoadedPatch={setLoadedPatch}
        setNodes={setNodes}
        bankType="global"
      />
    </div>
  )
}

export default App