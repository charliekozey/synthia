import React, { useState } from 'react'

function Header({ user, setUser }) {
    const [loginData, setLoginData] = useState({})
    const [showLoginForm, setShowLoginForm] = useState(false)
    const [showSignupForm, setShowSignupForm] = useState(false)

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


                {
                    user ?
                        <div>
                            <h4 id="user-name-display">logged in as {user.name}</h4>
                            <button onClick={logOut}>log out</button>
                        </div>
                        :
                        <div>
                            {
                                showLoginForm ?
                                <>
                                        <form onSubmit={logIn}>
                                            <input type="text" name="username" placeholder="username" onChange={handleChange}></input>
                                            <input type="password" name="password" placeholder="password" onChange={handleChange}></input>
                                            <input type="submit" value="log in"></input>
                                        </form>
                                        <button onClick={() => setShowLoginForm(false)}>cancel</button>
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
            <div>
                <pre>
                    {`
------------------------------------------------
black keys:      [w][e]  [t][y][u]   [o][p]
white keys:    [a][s][d][f][g][h][j][k][l][;][']
octave up/down: [z][x]

press escape to stop all sound
------------------------------------------------
`}
                </pre>
            </div>
        </>
    )
}

export default Header