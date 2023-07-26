import { useState } from 'react'
import Header from './Header.jsx'
import OscGenerators from './OscGenerators.jsx'
import OscBank from './OscBank.jsx'
import './App.css'

function App() {
  const [oscillators, setOscillators] = useState([])
  const keyboard = {
    "a": {freq: 262, down: false}, 
    "w": {freq: 277, down: false}, 
    "s": {freq: 294, down: false}, 
    "e": {freq: 311, down: false}, 
    "d": {freq: 330, down: false}, 
    "f": {freq: 349, down: false}, 
    "t": {freq: 370, down: false},
    "g": {freq: 392, down: false}, 
    "y": {freq: 415, down: false}, 
    "h": {freq: 440, down: false}, 
    "u": {freq: 466, down: false}, 
    "j": {freq: 494, down: false}, 
    "k": {freq: 523, down: false}, 
    "o": {freq: 554, down: false}, 
    "l": {freq: 587, down: false}, 
    "p": {freq: 622, down: false}, 
    ";": {freq: 659, down: false}, 
    "'": {freq: 698, down: false},
}
const audioContext = new AudioContext()
const oscNodes = []

function startSound(e) {
  const input = e.key
  
  if(Object.keys(keyboard).includes(input) && !keyboard[input].down) {
      oscillators.forEach(osc => {
          const oscNode = new OscillatorNode(audioContext, {type: osc.type, frequency: keyboard[input].freq, gain: 0})
          const gainNode = new GainNode(audioContext)
          oscNodes.push(oscNode)
          oscNode.connect(gainNode)
          gainNode.connect(audioContext.destination)
          oscNode.start()
      })
      keyboard[input].down = true
  }
}

function stopSound(e) {
  const input = e.key

  if(Object.keys(keyboard).includes(input)) {
      oscNodes.forEach(oscNode => {
          if (oscNode.frequency.value == keyboard[input].freq) oscNode.stop()
      })
      keyboard[input].down = false
  }
}

document.addEventListener("keydown", e => startSound(e))
document.addEventListener("keyup", e => stopSound(e))

  return (
    <>
      <Header />
      <OscGenerators oscillators={oscillators} setOscillators={setOscillators} />
      <OscBank oscillators ={oscillators} setOscillators={setOscillators} />
    </>
  )
}

export default App
