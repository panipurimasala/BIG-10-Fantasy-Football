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


/*let starters1 = {"QB":team1["QB"][0]["name"] + ", " + team1["QB"][0]["position"], 
    "RB":[team1["RB"][0]["name"] + ", " + team1["RB"][0]["position"], team1["RB"][1]["name"] + ", " + team1["RB"][1]["position"]],
    "WR":[team1["WR"][0]["name"] + ", " + team1["WR"][0]["position"], team1["WR"][1]["name"] + ", " + team1["WR"][1]["position"]],
    "TE":team1["TE"][0]["name"] + ", " + team1["TE"][0]["position"],
    "K":team1["K"][0]["name"] + ", " + team1["K"][0]["position"]}

let starters2 = {"QB":team2["QB"][0]["name"] + ", " + team2["QB"][0]["position"], 
    "RB":[team2["RB"][0]["name"] + ", " + team2["RB"][0]["position"], team2["RB"][1]["name"] + ", " + team2["RB"][1]["position"]],
    "WR":[team2["WR"][0]["name"] + ", " + team2["WR"][0]["position"], team2["WR"][1]["name"] + ", " + team2["WR"][1]["position"]],
    "TE":team2["TE"][0]["name"] + ", " + team2["TE"][0]["position"],
    "K":team2["K"][0]["name"] + ", " + team2["K"][0]["position"]}*/

function sortStarters(team) {
    team["bench"] = [];
    Object.keys(team).forEach((pos, index) => {
        if (team[pos].length >= 2) {
            for(let i = 1; i < team[pos].length; i++) {
                team["bench"].push(team[pos].slice(i, i + 1)[0]);
            }
        }
    });
    return team;
}
function addToTable(team, position) {
    //still bugged for wr and rb as they each have two slots
    if (team[position].length === 0) {
        return "None";
    }
    else {
        const player = team[position][0];
        return player["name"] + ", " + player["position"];
    }
}
function addBenchPlayers(team) {
    let playersString = "";
    team["bench"].forEach((player) => {
        playersString += player["name"] + ", " + player["position"] + ";";
    });
    return playersString;
}



const TeamPage = () => {
    let team1 = JSON.parse(localStorage.getItem("team1"));
    let team2 = JSON.parse(localStorage.getItem("team2"));
    if (team1 == null) {
        return(
            <div>
                <h1>No Team Drafted</h1>
                <br />
                <h2>Draft To Get Started!!!</h2>
            </div>
        );
    }
    else{
        team1 = sortStarters(team1);
        team2 = sortStarters(team2);
        console.log(team1);
        return (
            <div>
                <p>{<DisplayJson jsonData1={JSON.parse(localStorage.getItem("team1"))} jsonData2={JSON.parse(localStorage.getItem("team2"))}/>}</p>
                <body>
                    <div className="table-container">
                    <table border="1">
                    <thead>
                        <th colSpan="2">Team1</th>
                    </thead>
                    <tbody>
                        <th colSpan="2">Starters</th>
                        <tr>
                            <th>Player</th>
                            <th>Position</th>
                        </tr>
                        <tr>
                            <td>{addToTable(team1, "QB")}</td>
                            <td>QB</td>
                        </tr>
                        <tr>
                            <td>{addToTable(team1, "RB") + "; " + addToTable(team1, "RB")}</td>
                            <td>RB</td>
                        </tr>
                        <tr>
                            <td>{addToTable(team1, "WR") + "; " + addToTable(team1, "WR")}</td>
                            <td>WR</td>
                        </tr>
                        <tr>
                            <td>{addToTable(team1, "TE")}</td>
                            <td>TE</td>
                        </tr>
                        <tr>
                            <td>{addToTable(team1, "K")}</td>
                            <td>K</td>
                        </tr>
                        <th colSpan="2">Bench</th>
                        <tr colSpan="2">{addBenchPlayers(team1)}</tr>

                    </tbody>
                </table>
                <table border="1">
                    <thead>
                        <th colSpan="2">Team2</th>
                    </thead>
                    <tbody>
                        <th colSpan="2">Starters</th>
                        <tr>
                            <th>Player</th>
                            <th>Position</th>
                        </tr>
                        <tr>
                            <td>{addToTable(team2, "QB")}</td>
                            <td>QB</td>
                        </tr>
                        <tr>
                            <td>{addToTable(team2, "RB") + "; " + addToTable(team2, "RB")}</td>
                            <td>RB</td>
                        </tr>
                        <tr>
                            <td>{addToTable(team2, "WR") + "; " + addToTable(team2, "WR")}</td>
                            <td>WR</td>
                        </tr>
                        <tr>
                            <td>{addToTable(team2, "TE")}</td>
                            <td>TE</td>
                        </tr>
                        <tr>
                            <td>{addToTable(team2, "K")}</td>
                            <td>K</td>
                        </tr>
                        <th colSpan="2">Bench</th>
                        <tr colSpan="2">{addBenchPlayers(team2)}</tr>

                    </tbody>
                </table>
    
                    </div>
                </body>
                
            </div>
    
    );
    }
}
export default TeamPage;