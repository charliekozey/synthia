// TODO NEXT: 
// gain control for individual oscillators
// waveform manipulation (asdr, lfo) for individual oscillators

// TODO:
// ~ o s c i l l o s c o p e ~
// effects
// lfo
// EQ/filters
// loadable patches
// microtonality?
// user login
// beginner-friendly illustrations and self-guiding UI
// sequencer
// play more than 6 notes at a time?
// stereo? spatial??
// fix browser tab change bug (audio still plays)
// arpeggiator
// record output
// note repeat

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
const oscName = document.getElementById("osc-name")
const typeSelect = document.getElementById("type-select")
const gainSlider = document.getElementById("gain-slider")
const audioContext = new AudioContext()
const oscillators = []
const oscNodes = []

fetch("http://localhost:3000/patches")
.then(res => res.json())
.then(data => loadPatch(data[0].oscillators[0]))

function loadPatch(oscillator) {
    oscName.textContent = `Osc ${oscillator.name} >>`
    typeSelect.value = oscillator.type
    gainSlider.value = oscillator.gain

    oscillators.push(oscillator)
}

function startSound(e) {
    const input = e.key
    
    if(Object.keys(keyboard).includes(input) && !keyboard[input].down) {
        // oscillators.forEach(osc => {
        //     oscNode = new OscillatorNode(audioContext, {type: osc.type, frequency: keyboard[input].freq})
        //     gainNode = new GainNode(audioContext, { gain: parseFloat(osc.gain)})
        //     oscNodes.push(oscNode)
        //     oscNode.connect(gainNode)
        //     gainNode.gain.value = parseFloat(osc.gain)
        //     gainNode.connect(audioContext.destination)
        //     oscNode.start()
        //     console.log(osc.type)
        // })
        oscNode = new OscillatorNode(audioContext, {type: oscillators[0].type, frequency: keyboard[input].freq})
        gainNode = new GainNode(audioContext, { gain: parseFloat(oscillators[0].gain)})
        console.log(oscillators[0].gain)
        oscNodes.push(oscNode)
        oscNode.connect(gainNode)
        gainNode.connect(audioContext.destination)
        oscNode.start()
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

function changeWaveType(e) {
    oscillators[0].type = (e.target.value)
}

function changeGain(e) {
    oscillators[0].gain = e.target.value
}

document.addEventListener("keydown", e => startSound(e))
document.addEventListener("keyup", e => stopSound(e))
typeSelect.addEventListener("change", e => changeWaveType(e))
gainSlider.addEventListener("change", e => changeGain(e))