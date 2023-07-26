import { useEffect, useState } from 'react'
import Oscillator from './Oscillator'

function OscBank() {
  const [oscillators, setOscillators] = useState([])
  const keyboard = {
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
  }
  const audioContext = new AudioContext()
  const oscNodes = []

  useEffect(() => {
    fetch("http://localhost:3000/patches")
    .then(res => res.json())
    .then(data => setOscillators(data[0].oscillators))
  }, [])

  function startSound(e) {
    const input = e.key

    if (Object.keys(keyboard).includes(input) && !keyboard[input].down) {
      oscillators.forEach(osc => {
        const oscNode = new OscillatorNode(audioContext, { type: osc.type, frequency: keyboard[input].freq, gain: 0 })
        const gainNode = new GainNode(audioContext)
        oscNodes.push(oscNode)
        oscNode.connect(gainNode)
        gainNode.connect(audioContext.destination)
        ///// HERE'S WHERE I LEFT OFF
        gainNode.gain.value = osc.gain
        console.log(gainNode)
        oscNode.start()
      })
      keyboard[input].down = true
    }
  }

  function stopSound(e) {
    const input = e.key

    if (Object.keys(keyboard).includes(input)) {
      oscNodes.forEach(oscNode => {
        if (oscNode.frequency.value == keyboard[input].freq) oscNode.stop()
      })
      keyboard[input].down = false
    }
  }

  document.addEventListener("keydown", e => startSound(e))
  document.addEventListener("keyup", e => stopSound(e))

  return (
    <div id="osc-bank">
      {
        oscillators.map(osc => {
          return <Oscillator osc={osc} oscillators={oscillators} setOscillators={setOscillators} key={osc.name} />
        })
      }
    </div>
  )
}

export default OscBank