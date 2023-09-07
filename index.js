// function todo() {
    // NOW DOING:
        // GET user favorites
        // user login
        // add new patch
    
    // TODO:
        // remove unused gain node on note end
        // waveform manipulation (asdr) for individual oscillators
        // gain sliders not working right; i think there's an extra node hanging out somewhere
        // fix: behavior differs between click+slide vs. click on gain sliders
        // update gitignore
        // investigate beating
        // ~ o s c i l l o s c o p e ~
        // fix static on gain slider change
        // effects
        // lfo
        // EQ/filters
        // microtonality?
        // beginner-friendly illustrations and self-guiding UI
        // sequencer
        // play more than 6 notes at a time?
        // stereo? spatial??
        // fix browser tab change bug (audio still plays)
        // arpeggiator

    // REFACTOR: 
        // abstract out updateGain/updateRelease/updateAttack etc functions
        
    // IDEAS:
        // target ed space? younger audience?
        // display held down keys in visual representation (qwerty? piano? both?)
        // calculate chord from held notes and display it
        // incorporate sequencer, etc
        // maybe similar target audience to hookpad
        // trackpad as xy manipulator for pitch, other params
        // record output
// }

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
const switchUserButton = document.getElementById('switch-user-button')
let userId = 49

// fetch("http://localhost:4000/patches")
// .then(res => res.json())
// .then(data => initializePatchList(data))

fetch(`http://localhost:4000/users/49`)
.then(res =>res.json())
.then(data => initializeUser(data))

function initializeUser(user) {
    console.log(user)
    const userNameDisplay = document.getElementById('user-name-display')
    
    userNameDisplay.textContent = `logged in as ${user.name}`

    initializePatchList(user.patches)
}

function initializePatchList(patches) {
    console.log(patches)
    const patchBank = document.getElementById("patch-bank")

    while (patchBank.hasChildNodes()) {
        patchBank.removeChild(patchBank.lastChild)
    }

    console.log(patchBank)
    
    if (patches.length > 0) {
        patches.forEach(patch => {
            const patchItem = document.createElement("div")

            patchBank.append(patchItem)
            patchItem.textContent = patch.name
            patchItem.addEventListener("click", e => {
                loadPatch(patch)
            })
        })  

        loadPatch(patches[0])
    } else {
        const noPatchMessage = document.createElement("div")
        noPatchMessage.textContent = "No patches yet. Create one below!"
        patchBank.append(noPatchMessage)
    }
}

function loadPatch(patch) {
    const patchTitle = document.getElementById("patch-title")

    patchTitle.textContent = patch.name

    oscillators.length = 0
    
    patch.oscillators.forEach(osc => {
        const typeSelect = document.getElementById(`type-select-${osc.number}`)
        const gainSlider = document.getElementById(`gain-slider-${osc.number}`)
        const attackSlider = document.getElementById(`attack-slider-${osc.number}`)
        const releaseSlider = document.getElementById(`release-slider-${osc.number}`)
        typeSelect.value = osc.osc_type
        gainSlider.value = osc.gain
        attackSlider.value = osc.attack
        releaseSlider.value = osc.release

        gainSlider.addEventListener("input", e => updateGain(e, osc.gain, osc.id))
        
        oscillators.push(osc)

        // console.log(osc.release + "=>" + logifyValue(osc.release))
    })

}

function changeUser() {
    userId ++

    fetch(`http://localhost:4000/users/${userId}`)
    .then(res =>res.json())
    .then(data => initializeUser(data))
}
 
function startSound(e) {
    if (e.repeat) return

    const input = e.key
    const placeholderPatchGain = 0.5
    const patchGainNode = new GainNode(audioContext, { gain: parseFloat(placeholderPatchGain)})
    const placeHolderAttackTime = 0.5

    if(Object.keys(keyboard).includes(input) && !keyboard[input].down) {
        patchGainNode.gain.setValueAtTime(0.0000000001, audioContext.currentTime)
        patchGainNode.gain.exponentialRampToValueAtTime(parseFloat(placeholderPatchGain) * 0.1, audioContext.currentTime + parseFloat(placeHolderAttackTime))

        oscillators.forEach(osc => {
            // const attackTime = logifyValue(osc.attack)
            console.log(osc.number + " activating")
            const oscNode = new OscillatorNode(audioContext, {type: osc.osc_type, frequency: keyboard[input].freq})
            const oscGainNode = new GainNode(audioContext, {type: osc.gain, frequency: keyboard[input].freq})
            const typeSelect = document.getElementById(`type-select-${osc.number}`)
            const gainSlider = document.getElementById(`gain-slider-${osc.number}`)
            const releaseSlider = document.getElementById(`release-slider-${osc.number}`)
            const attackSlider = document.getElementById(`attack-slider-${osc.number}`)

            oscNode.connect(oscGainNode)
            oscGainNode.connect(patchGainNode)
            patchGainNode.connect(audioContext.destination)
            oscNode.start()

            // TODO: MAKE THESE WORK SOMETIME /////////////////////////////////////
            // gainSlider.addEventListener("input", e => updateGain(e, oscGainNode.gain.value, osc.id))
            // releaseSlider.addEventListener("input", e => oscillators[0].gain = parseFloat(e.target.value))
            // attackSlider.addEventListener("input", e => oscillators[0].gain = parseFloat(e.target.value))
            // typeSelect.addEventListener("input", e => oscillators[0].osc_type = e.target.value)

            // nodes.push({
            //     osc_node: oscNode,
            //     gain_node: patchGainNode,
            //     key_pressed: input,
            //     osc_data: osc
            // })

            document.addEventListener("keyup", e => stopSound(patchGainNode, oscGainNode, oscNode, input, osc))
            // document.removeEventListener("keydown", e => startSound(e))
        })

        keyboard[input].down = true
    }

}

function stopSound(patchGainNode, oscGainNode, oscNode, input, osc) {
    // console.log(patchGainNode)
    // console.log(oscNode)
    // console.log(audioContext)
    const releaseTime = logifyValue(osc.release)
    console.log(100*releaseTime)
    patchGainNode.gain.setValueAtTime(patchGainNode.gain.value, audioContext.currentTime)
    // node.gain_node.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.05)
    patchGainNode.gain.exponentialRampToValueAtTime(0.0000000001, audioContext.currentTime + parseFloat(releaseTime) * 10)

    setTimeout(() => {
        patchGainNode.disconnect()
        oscGainNode.disconnect()
        oscNode.disconnect()
        // console.log("at stop:", nodes)
    }, releaseTime + 1000)

    // document.removeEventListener("keydown", e => startSound(e))
    keyboard[input].down = false
}

function changeOctave(e) {
    for (const note in keyboard) {
        if (e.key == "z") {
            keyboard[note].freq = keyboard[note].freq / 2
        }
        if (e.key == "x") {
            keyboard[note].freq = keyboard[note].freq * 2
        }
    }

}

function panic(e) {
    if (e.key == "Escape"){
        nodes.forEach(node => {
            console.log("stopping node")
            node.gain_node.gain.setValueAtTime(node.gain_node.gain.value, audioContext.currentTime)
            node.gain_node.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.002)

            setTimeout(() => {
                node.gain_node.disconnect()
                node.osc_node.disconnect()
            }, 51)
        })
    }
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
        body: JSON.stringify({gain: gainToUpdate})
    })
        .then(res => res.json())
        .then(data => console.log(data.message))
}

document.addEventListener("keydown", e => startSound(e))
document.addEventListener("keydown",  e => changeOctave(e))
document.addEventListener("keydown",  e => panic(e))
switchUserButton.addEventListener("click", () => changeUser())

function logifyValue(position) {
    const minInput = 0
    const maxInput = 100

    const minValue = Math.log(0.1)
    const maxValue = Math.log(10000000)

    const scale = (maxInput - minInput) / (maxValue - minValue)

    return Math.exp(minValue + scale*(position-minInput))
}

// initializeUser(userId)

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