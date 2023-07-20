// TODO NEXT: polyphony; maybe by creating a stack of AudioContexts? 
// Then startSound() would push a new AudioContext and connect each oscillator to it
// and stopSound() would remove them all

const oscGenerators = document.getElementById("osc-generators")
const notes = {"a": 220, "s": 247, "d": 277, "f": 294, "g": 330, "h": 370, "j": 415, "k": 440, "l": 494}
let audioContext
let oscillators = []
let oscNodes = []
let playing = false

function addOscillator(e) {
    const newOsc = document.createElement("div")
    const oscBank = document.getElementById("osc-bank")
    if(e.target.nodeName==="BUTTON") {
        newOsc.textContent = e.target.id
        oscBank.append(newOsc) 
        oscillators.push({type: `${e.target.id}`, frequency: 220})
    }
}

function startSound(e) {
    const input = e.key
    audioContext = new AudioContext()
    console.log(oscillators)

    if(Object.keys(notes).includes(input) && !playing) {
        oscillators.forEach(osc => {
            oscNode = new OscillatorNode(audioContext, {type: osc.type, frequency: notes[input]})
            oscNodes.push(oscNode)
            oscNode.connect(audioContext.destination)
            oscNode.start()
        })
        playing = true
    }
}

function stopSound(e) {
    const input = e.key
    if(Object.keys(notes).includes(input)) {
        oscNodes.forEach(oscNode => {
            oscNode.stop()
        })
        playing = false
        audioContext.close()
    }
}

oscGenerators.addEventListener("click", e => addOscillator(e))
document.addEventListener("keydown", e => startSound(e))
document.addEventListener("keyup", e => stopSound(e))

// SOMEDAY:
// user login
// save patches
// beginner-friendly illustrations and self-guiding UI