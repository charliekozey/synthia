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
// sequencer

const oscGenerators = document.getElementById("osc-generators")
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
const oscillators = []
const oscNodes = []
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
    
    if(Object.keys(keyboard).includes(input) && !keyboard[input].down) {
        oscillators.forEach(osc => {
            console.log(osc)
            oscNode = new OscillatorNode(audioContext, {type: osc.type, frequency: keyboard[input].freq})
            oscNodes.push(oscNode)
            oscNode.connect(audioContext.destination)
            oscNode.start()
        })
        keyboard[input].down = true
        console.log(keyboard[input].down)
        console.log(keyboard)
    }
}

function stopSound(e) {
    const input = e.key

    if(Object.keys(keyboard).includes(input)) {
        oscNodes.forEach(oscNode => {
            oscNode.stop()
        })
        keyboard[input].down = false
        console.log((keyboard[input].down))
        console.log(keyboard)
    }
}

oscGenerators.addEventListener("click", e => addOscillator(e))
document.addEventListener("keydown", e => startSound(e))
document.addEventListener("keyup", e => stopSound(e))