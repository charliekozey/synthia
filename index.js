// NOW DOING: 
// rough sketch of ui

// TODO:
// ~ o s c i l l o s c o p e ~
// waveform manipulation (asdr) for individual oscillators
// fix clicking on gain slider change
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
// multiple oscillators
// remove unused gain node on note end


// IDEAS:
// target ed space? younger audience?
// maybe similar target audience to hookpad

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
const nodes = []

fetch("http://localhost:4000/patches")
.then(res => res.json())
.then(data => initializePatches(data))

function initializePatches(data) {
    const patchBank = document.getElementById("patch-bank")
    data.forEach(patch => {
        const patchItem = document.createElement("div")
        patchItem.textContent = patch.name
        patchBank.append(patchItem)
        patchItem.addEventListener("click", e => {
            loadPatch(patch)
        })
    })
}

function loadPatch(patch) {
    patch.oscillators.forEach(osc => {
        console.log(osc.gain)
        const oscName = document.getElementById("osc-name")
        const typeSelect = document.getElementById("type-select")
        const gainSlider = document.getElementById("gain-slider")
        oscName.textContent = `Osc ${osc.number} >>`
    })
    // typeSelect.value = oscillator.type
    // gainSlider.value = oscillator.gain

    // oscillators.push(oscillator)
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
        const oscNode = new OscillatorNode(audioContext, { type: oscillators[0].type, frequency: keyboard[input].freq })
        const gainNode = new GainNode(audioContext, { gain: oscillators[0].gain })

        oscNode.connect(gainNode)
        gainNode.connect(audioContext.destination)
        oscNode.start()

        gainSlider.addEventListener("input", e => gainNode.gain.value = parseFloat(e.target.value))
        gainSlider.addEventListener("change", e => oscillators[0].gain = parseFloat(e.target.value))
        typeSelect.addEventListener("change", e => oscillators[0].type = e.target.value)

        nodes.push({
            osc: oscNode,
            gain: gainNode,
            key_pressed: input
        })
        keyboard[input].down = true
    }
}

function stopSound(e) {
    const input = e.key
        
    if(Object.keys(keyboard).includes(input)) {
        nodes.forEach(node => {
            if (node.key_pressed == input) {
                node.gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.005)
                setTimeout(() => {
                    node.gain.disconnect()
                }, 6)
            }
        })
        keyboard[input].down = false
    }
}

document.addEventListener("keydown", e => startSound(e))
document.addEventListener("keyup", e => stopSound(e))