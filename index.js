// TODO NEXT: 
// gain control for individual oscillators
// waveform manipulation (asdr, lfo) for individual oscillators

// TODO: 
// ~ o s c i l l o s c o p e ~
// effects
// lfo
// EQ/filters
// patches
// microtonality?
// user login
// beginner-friendly illustrations and self-guiding UI
// sequencer
// play more than 6 notes at a time?
// stereo? spatial??
// fix browser tab change bug (audio still plays)

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
const oscGenerators = document.getElementById("osc-generators")
const audioContext = new AudioContext()
const oscillators = []
const oscNodes = []
let playing = false

function addOscillator(e) {
    const newOsc = document.createElement("div")
    const oscBank = document.getElementById("osc-bank")
    const oscTitle = document.createElement("h4")
    const gainSlider = document.createElement("input")
    const gainLabel = document.createElement("label")

    gainSlider.type = "range"
    gainSlider.name = "gain"
    gainLabel.textContent = "gain"
    
    if(e.target.nodeName==="BUTTON") {
        oscTitle.textContent = e.target.id
        newOsc.append(oscTitle)
        newOsc.append(gainLabel)
        newOsc.append(gainSlider)
        oscBank.append(newOsc)
        oscillators.push({type: `${e.target.id}`})
    }
}

function startSound(e) {
    const input = e.key
    
    if(Object.keys(keyboard).includes(input) && !keyboard[input].down) {
        oscillators.forEach(osc => {
            const gainNode = audioContext.createGain()
            const oscNode = new OscillatorNode(audioContext, {type: osc.type, frequency: keyboard[input].freq})
            oscNodes.push(oscNode)
            oscNode.connect(gainNode)
            gainNode.gain = 
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

oscGenerators.addEventListener("click", e => addOscillator(e))
document.addEventListener("keydown", e => startSound(e))
document.addEventListener("keyup", e => stopSound(e))