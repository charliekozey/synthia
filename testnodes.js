const gainSlider = document.getElementById("gain-slider")
const startStopBtn = document.getElementById("start-stop")
const audioCtx = new AudioContext()
let playing = false
let oscNode
let gainNode

function startAudio() {
    oscNode = new OscillatorNode(audioCtx, {type: "sine", frequency: 220})
    gainNode = new GainNode(audioCtx, {gain: 0.1})
    oscNode.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    oscNode.start()
}

function stopAudio() {
    oscNode.stop()
}

startStopBtn.addEventListener("click", e => {
    if (!playing) startAudio(); else stopAudio()
    playing = !playing
})

gainSlider.addEventListener("change", e => {
    gainNode.gain.value = e.target.value
})
