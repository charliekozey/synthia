import React from 'react'

function Header({user}) {
    return (
        <>
            <header id="header">
                <h1>welcome to ~ s y n t h i a ~</h1>
                {/* <button id="switch-user-button">switch user</button> */}
                {
                    user ?
                        <h2 id="user-name-display">logged in as {user.name} </h2>
                        :
                        <h2 id="user-name-display">playing as guest. create an account to save your favorite patches.</h2>
                }
            </header>
            <h2>
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
            </h2>
        </>
    )
}

export default Header