import React, { useState } from 'react'

function Header({ user, setUser }) {
    const [loginData, setLoginData] = useState({})
    const [showLoginForm, setShowLoginForm] = useState(false)
    const [showSignupForm, setShowSignupForm] = useState(false)
    const [showHowToPlay, setshowHowToPlay] = useState(false)

    function handleChange(e) {
        const { name, value } = e.target
        setLoginData({ ...loginData, [name]: value })
    }

    function logIn(e) {
        e.preventDefault()

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
                                showLoginForm ?
                                    <>
                                        <span>
                                            <form onSubmit={logIn}>
                                                <input type="text" name="username" placeholder="username" onChange={handleChange}></input>
                                                <input type="password" name="password" placeholder="password" onChange={handleChange}></input>
                                                <input type="submit" value="log in"></input>
                                                <button onClick={() => setShowLoginForm(false)}>cancel</button>
                                            </form>
                                        </span>
                                    </>
                                    :
                                    <>
                                        <span id="user-name-display">playing as guest</span>
                                        <button onClick={() => setShowLoginForm(true)}>log in</button>
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