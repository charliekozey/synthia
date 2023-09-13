// function todo() {
// NOW DOING:
// save patch settings (now just oscillator data back end)

// TODO:
// add new patch
// social patch info
// GET user favorites
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
const oscillators = []
const switchUserButton = document.getElementById('switch-user-button')
const addPatchButton = document.getElementById("new-patch-button")
const savePatchButton = document.getElementById("save-patch-button")
let userId = 1
let userState = {}
let patchState = {}

fetch("http://localhost:4000/patches")
    .then(res => res.json())
    .then(data => initializePatchList(data, "global"))

fetch(`http://localhost:4000/users/1`)
    .then(res => res.json())
    .then(data => initializeUser(data))

function clearDomNode(domNode) {
    while (domNode.hasChildNodes()) {
        domNode.removeChild(domNode.lastChild)
    }
}

function initializeUser(user_data) {
    const userNameDisplay = document.getElementById('user-name-display')
    const userPatchHeader = document.getElementById('user-patch-header')
    
    userState = user_data
    console.log("USER STATE:", userState)
    userNameDisplay.textContent = `logged in as ${user_data.name}`
    userPatchHeader.style.display = "block"

    initializePatchList(user_data.patches, "user")
}

function initializePatchList(patches, source) {
    console.log(patches)
    const patchBank = document.getElementById(`${source}-patch-bank`)

    clearDomNode(patchBank)

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
        noPatchMessage.textContent = "No patches yet. Create one above!"
        patchBank.append(noPatchMessage)
    }
}

function loadPatch(patch) {
    const patchInfo = document.getElementById("patch-info")
    const patchName = document.createElement("h3")
    const patchCreator = document.createElement("h5")
    // const editPatchNameButton = document.createElement("button")

    clearDomNode(patchInfo)

    patchInfo.append(patchName)
    // patchInfo.append(editPatchNameButton)
    patchInfo.append(patchCreator)
    patchCreator.style.fontStyle = "italic"

    patchName.textContent = patch.name
    patchCreator.textContent = `by ${patch.creator.name}`
    // editPatchNameButton.textContent = "edit patch name"

    // editPatchNameButton.addEventListener("click", (e) => {
    //     editPatchName(e, patchName)
    // })

    oscillators.length = 0

    patch.oscillators.forEach(osc => {
        const typeSelect = document.getElementById(`osc_type-select-${osc.number}`)
        const gainSlider = document.getElementById(`gain-slider-${osc.number}`)
        const attackSlider = document.getElementById(`attack-slider-${osc.number}`)
        const releaseSlider = document.getElementById(`release-slider-${osc.number}`)
        typeSelect.value = osc.osc_type
        gainSlider.value = osc.gain
        attackSlider.value = osc.attack
        releaseSlider.value = osc.release

        typeSelect.addEventListener("input", e => updateValue(e, osc))
        gainSlider.addEventListener("input", e => updateValue(e, osc))
        attackSlider.addEventListener("input", e => updateValue(e, osc))
        releaseSlider.addEventListener("input", e => updateValue(e, osc))

        oscillators.push(osc)

        // console.log(osc.release + "=>" + logifyValue(osc.release))
    })

    toggleSaveButton(true)
    patchState = patch
    console.log("PATCH STATE", patchState)
}

function changeUser() {
    userId++

    fetch(`http://localhost:4000/users/${userId}`)
        .then(res => res.json())
        .then(data => initializeUser(data))
}

function startSound(e) {
    if (e.repeat) return

    const input = e.key
    const placeholderPatchGain = 0.5
    const patchGainNode = new GainNode(audioContext, { gain: parseFloat(placeholderPatchGain) })
    const placeHolderAttackTime = 0.5

    if (Object.keys(keyboard).includes(input) && !keyboard[input].down) {
        patchGainNode.gain.setValueAtTime(0.0000000001, audioContext.currentTime)
        patchGainNode.gain.linearRampToValueAtTime(parseFloat(placeholderPatchGain) * 0.1, audioContext.currentTime + parseFloat(placeHolderAttackTime))

        oscillators.forEach(osc => {
            // const attackTime = logifyValue(osc.attack)
            console.log(osc.number + " activating")
            const oscNode = new OscillatorNode(audioContext, { type: osc.osc_type, frequency: keyboard[input].freq })
            const oscGainNode = new GainNode(audioContext, { type: osc.gain, frequency: keyboard[input].freq })
            const typeSelect = document.getElementById(`osc_type-select-${osc.number}`)
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
    console.log(100 * releaseTime)
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
    if (e.key == "Escape") {
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

function updateValue(e, editedOsc) {
    toggleSaveButton(false)

    const updatedValue = e.target.name === `osc_type-${editedOsc.number}` ?
        e.target.value
        :
        parseFloat(e.target.value) 
    const slicedName = e.target.name.slice(0, -2)

    // console.log(e.target.name, ":", updatedValue)

    patchState.oscillators.forEach(osc => {
        if (parseFloat(osc.number) === editedOsc.number) {
            osc[slicedName] = updatedValue
            console.log(slicedName, osc[slicedName])
        }
    })

    console.log("PATCH STATE AFTER UPDATE:", patchState)
}

function addNewPatch() {
    const newPatch = {
        "creator": {
            "id": userState.id,
            "name": userState.name
        },
        "name": "new patch",
        "oscillators": [
            {
                "attack": 0.2,
                "decay": 0.2,
                "gain": 0.2,
                "id": 1,
                "number": 1,
                "osc_type": "sine",
                "release": 0.2,
                "sustain":0.2
            },
            {
                "attack": 0.2,
                "decay": 0.2,
                "gain": 0.2,
                "id": 2,
                "number": 2,
                "osc_type": "sine",
                "release": 0.2,
                "sustain": 0.2
            },
            {
                "attack": 0.2,
                "decay": 0.2,
                "gain": 0.2,
                "id": 3,
                "number": 3,
                "osc_type": "sine",
                "release": 0.2,
                "sustain": 0.2
            }
        ]
    }

    loadPatch(newPatch)
}

function savePatch(e, patchState) {
    toggleSaveButton(true)

    fetch(`http://localhost:4000/patches/${patchState.id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(patchState)
    })

} 

function editPatchName(e, patchName) {
    const editField = document.createElement("input")

    editField.type = "text"
    editField.placeholder = patchName.textContent

    patchName.after(editField)
    patchName.style.display = "none"
}

function toggleSaveButton(saved) {
    if (saved) {
        savePatchButton.style.backgroundColor = "slateGray"
        savePatchButton.style.pointerEvents = "none"
        savePatchButton.textContent = "patch saved!"
    } else {
        savePatchButton.style.removeProperty("background-color")
        savePatchButton.style.removeProperty("pointer-events")
        savePatchButton.textContent = "save settings"
    }
}

document.addEventListener("keydown", e => startSound(e))
document.addEventListener("keydown", e => changeOctave(e))
document.addEventListener("keydown", e => panic(e))
switchUserButton.addEventListener("click", () => changeUser())
addPatchButton.addEventListener("click", () => addNewPatch())
savePatchButton.addEventListener("click", (e) => savePatch(e, patchState))

function logifyValue(position) {
    const minInput = 0
    const maxInput = 100

    const minValue = Math.log(0.1)
    const maxValue = Math.log(10000000)

    const scale = (maxInput - minInput) / (maxValue - minValue)

    return Math.exp(minValue + scale * (position - minInput))
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