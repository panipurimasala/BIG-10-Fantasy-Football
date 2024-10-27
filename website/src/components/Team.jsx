import React from "react";


function testPrintPlayers(team){
    let retarr = [];
    Object.keys(team).forEach(pos => {
        team[pos].forEach(player => {
            retarr.push(player.position + ": " + player.name + " ");
        })
    })
    return retarr;
}

const DisplayJson = ({jsonData1, jsonData2}) => {
    if (localStorage.getItem("team1") == null) {
        return (
            <div>
                <h1>No Teams Drafted</h1>
                <br />
                <h2>Draft To Get Started!!!</h2>
            </div>);
    }
    else {
        return (
        <div>
            <div>
                <h2>Team1 Roster</h2>
                <ul>
                    <p><strong>Players:</strong> {testPrintPlayers(jsonData1)}</p>
                </ul>
            </div>
            <div>
                <h2>Team2 Roster</h2>
                <ul>
                    <p><strong>Players:</strong> {testPrintPlayers(jsonData2)}</p>
                </ul>
            </div>
        </div>);
    }
    
    
};

const TeamPage = () => {
    

    return (
        <div>
            <p>{<DisplayJson jsonData1={JSON.parse(localStorage.getItem("team1"))} jsonData2={JSON.parse(localStorage.getItem("team2"))}/>}</p>
        </div>

);
}
export default TeamPage;