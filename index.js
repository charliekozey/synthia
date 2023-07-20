// build oscillator bank
// button: add new sine osc
// button: add new square osc
// button: add new saw osc
// button: add new triangle osc
// button: add new custom osc

const addSine = document.getElementById("sine")
const addSquare = document.getElementById("square")
const addSaw = document.getElementById("sawtooth")
const addTriangle = document.getElementById("triangle")
const addCustom = document.getElementById("custom")
const oscBank = document.getElementById("osc-bank")
const oscGenerators = document.getElementById("osc-generators")
let audioContext
let oscillators = []
let oscNodes = []
let playing = false

function addOscillator(e) {
    const newOsc = document.createElement("div")

    if(e.target.nodeName==="BUTTON") {
        newOsc.textContent = e.target.id
        oscBank.append(newOsc)
                
        oscillators.push({type: `${e.target.id}`, frequency: 220})
    }
}

function startSound(e) {
    audioContext = new AudioContext()
    console.log(audioContext)
    console.log(playing)

    if(e.key == "j" && !playing) {
        oscillators.forEach(osc => {
            // if(osc.id == parseInt(buttonId)) {
            //     console.log("hit")
            //     osc.start()
            //     console.log(osc.id)
            // }
            oscNode = new OscillatorNode(audioContext, {type: osc.type, frequency: osc.frequency})
            oscNodes.push(oscNode)
            oscNode.connect(audioContext.destination)
            oscNode.start()
        })
        playing = true
    }
}

function stopSound(e) {
    if(e.key == "j") {
        oscNodes.forEach(oscNode => {
            // if(osc.id == parseInt(buttonId)) {
            //     console.log("hit")
            //     osc.start()
            //     console.log(osc.id)
            // }
            oscNode.stop()
        })
        playing = false
        audioContext.close()
        console.log("stop")
    }
}

oscGenerators.addEventListener("click", e => addOscillator(e))

document.addEventListener("keydown", e => startSound(e))
document.addEventListener("keyup", e => stopSound(e))

// SOMEDAY:
// user login
// save patches
// beginner-friendly illustrations and self-guiding UI

// const test = [1, 2, 3, 2]

// test.forEach(num => {
//     if(num === 2) {
//         console.log("hit")
//         // osc.connect(audioContext.destination)
//         // console.log(osc)
//     }
// })