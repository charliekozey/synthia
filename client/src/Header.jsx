import React, { useState } from 'react'

function Header({ user, setUser }) {
    const [loginData, setLoginData] = useState({})
    const [authMode, setAuthMode] = useState(null)
    const [showHowToPlay, setshowHowToPlay] = useState(false)

    function handleChange(e) {
        const { name, value } = e.target
        setLoginData({ ...loginData, [name]: value })
    }

    function authenticate(e) {
        e.preventDefault()

        if (authMode == "log in") {
            fetch("http://localhost:5555/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: loginData.username
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setUser(data)
                })
        }

        // if (authMode == "sign up") {
        // ...
        // }

    }

    function logOut(e) {
        fetch("http://localhost:5555/logout", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(message => console.log(message))

        setUser(null)
        setShowLoginForm(false)
    }

    return (
        <>
            <header id="header">
                <h4>~ s y n t h i a ~</h4>
                <h4 id="how-play-link" onClick={() => setshowHowToPlay(s => !s)}>how to play</h4>

                {
                    user ?
                        <div>
                            <span id="user-name-display">logged in as {user.name}</span>
                            <button onClick={logOut}>log out</button>
                        </div>
                        :
                        <div>
                            {
                                authMode ?
                                    <>
                                        <span>
                                            <form onSubmit={authenticate}>
                                                <input type="text" name="username" placeholder="username" onChange={handleChange}></input>
                                                <input type="password" name="password" placeholder="password" onChange={handleChange}></input>
                                                <input type="submit" value={`${authMode}`}></input>
                                                <button onClick={() => setAuthMode(null)}>cancel</button>
                                            </form>
                                        </span>
                                    </>
                                    :
                                    <>
                                        <span id="user-name-display">playing as guest</span>
                                        <button onClick={() => setAuthMode("log in")}>log in</button>
                                        <button onClick={() => setAuthMode("sign up")}>sign up</button>
                                    </>
                            }
                        </div>
                }

            </header>

            { showHowToPlay ?
                    <div id="how-to-play">
                        <p>Welcome to synthia!</p>
                        <p>Use your QWERTY keyboard to make sounds.</p>
                        <p>An oscillator generates a sound wave.</p>
                        <p>The shape of the wave determines its texture: is it smooth-sounding, harsh, spiky?</p>
                        <p>Combine oscillators to create custom sounds.</p>
                        <p>Adjust the sliders to change the sounds.</p>
                        <p>Gain changes the loudness of an oscillator.</p>
                        <p>Attack changes the amount of time between pressing a key and reaching peak volume.</p>
                        <p>Release changes the amount of time the sound lingers after you stop pressing the key.</p>
                        <p>A patch is a saved snapshot of settings you can return to later.</p>
                        <p>Log in or create an account to save your own patches.</p>
                        <p>Explore sounds made by other users in <em>global patches</em>.</p>
                        <pre>
                    {`
------------------------------------------------
black keys:      [w][e]  [t][y][u]   [o][p]
white keys:    [a][s][d][f][g][h][j][k][l][;][']
octave down/up: [z][x]

press escape to stop all sound
------------------------------------------------
`}
                        </pre>
                    </div>
                    :
                    <>
                    </>
                }

        </>
    )
}

export default Header