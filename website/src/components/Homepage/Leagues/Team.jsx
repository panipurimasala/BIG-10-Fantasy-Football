import React, {useState} from "react";
import './Team.css';


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
        return player["name"];
    }
}


const teamTable = (team) => {
    return (
        <body>
            <div className="table-container">
            <table className="table">
            <tbody>
                <tr>
                    <td className = "position">QB</td>
                    <td className="player">{addToTable(team, "QB")}</td>
                </tr>
                <tr>
                    <td className = "position">RB</td>
                    <td className="player">{addToTable(team, "RB")}</td>
                </tr>
                <tr>
                    <td className = "position">RB</td>
                    <td className="player">{addToTable(team, "RB")}</td>
                </tr>
                <tr>
                    <td className = "position">WR</td>
                    <td className="player">{addToTable(team, "WR")}</td>
                </tr>
                <tr>
                    <td className = "position">WR</td>
                    <td className="player">{addToTable(team, "WR")}</td>
                </tr>
                <tr>
                    <td className = "position">TE</td>
                    <td className="player">{addToTable(team, "TE")}</td>
                </tr>
                <tr>
                    <td className = "position">FLEX</td>
                    <td className="player">{addToTable(team, "TE")}</td>
                </tr>
                <tr>
                    <td className = "position">K</td>
                    <td className="player">{addToTable(team, "K")}</td>
                </tr>
                {/*<th colSpan="2">Bench</th>
                <tr colSpan="2">{addBenchPlayers(team1)}</tr>*/}
            </tbody>
        </table>
        <table className="benchTable">
            <thead>
                <th className="benchTitle">Bench</th>
            </thead>
            <tbody>
                {team["bench"].map((player, index) => (
                    <tr key={index}>
                        <td className="benchRow"><span style={{ fontWeight: "bold"}}>{player.name} - </span> 
                        <span style={{fontStyle: "italic", color: "gray"}}>{player.position}</span></td>
                    </tr>
                ))}
            </tbody>
        </table>

            </div>
        </body>
    );
}


const TeamPage = () => {
    let team1 = JSON.parse(localStorage.getItem("team1"));
    let team2 = JSON.parse(localStorage.getItem("team2"));

    let teamToDisplay;
    const[titleTeam, setTitleTeam] = useState("Your Team");
    const handleTeamChange = (e) => {
        teamToDisplay = titleTeam;
        setTitleTeam(e.target.value);
    }

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
        //console.log(team1);
        return (
            <div>
                <div className="pageHeader">
                    <h1 className="title">{titleTeam}</h1>
                    <select name="teamSelect" id="teamSelect" onChange={handleTeamChange}>
                        <option value="Team1">Your Team</option>
                        <option value="Team2">Other Team</option>
                    </select>
                </div>
                {teamTable(team1)}
            </div>
    
    );
    }
}
export default TeamPage;