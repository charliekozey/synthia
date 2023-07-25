// TODO NEXT: polyphony; maybe by creating a stack of AudioContexts? (no, hashmap is better)
// Then startSound() would push a new AudioContext and connect each oscillator to it
// and stopSound() would remove them all

// TODO: 
// waveform manipulation (asdr, lfo)
// effects
// patches
// microtonality?
// user login
// beginner-friendly illustrations and self-guiding UI

const oscGenerators = document.getElementById("osc-generators")
const notes = {"a": 262, "w": 277, "s": 294, "e": 311, "d": 330, "f": 349, "t": 370, "g": 392, "y": 415, "h": 440, "u": 466, "j": 494, "k": 523, "o": 554, "l": 587, "p": 622, ";": 659, "'": 698}
const audioContexts = []
const oscillators = []
const oscNodes = []
let audioContext
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


// testing audiocontext stack plan

function pushAudioContext(e) {
    const keys = ["z", "x", "c", "v", "b", "n", "m"]
    if (keys.includes(e.key)) {
        const newAudioContext = new AudioContext()
        audioContexts.push(newAudioContext)

        console.log(audioContexts)
    }
}

document.addEventListener("keypress", e => pushAudioContext(e))