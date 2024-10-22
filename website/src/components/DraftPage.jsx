import React, { useState } from "react";

function getRosterData(){
    let allPlayers = require("../mock_data/allPlayers.json");
    let playerDict = {};
    const pos_arr = ["QB", "RB", "WR", "TE", "K"];
    Object.keys(allPlayers).forEach(player => {
        if (pos_arr.indexOf(allPlayers[player].position) !== -1){
            playerDict[player] = allPlayers[player];
        }
    })
    return playerDict;
}

function draftPlayer(playerDict, player, team, position){
    if(!Object.keys(playerDict).includes(player)){
        return "no player found";
    }
    if (playerDict[player].position !== position) {
        return "player does not play this position"
    }
    let playerToAdd = playerDict[player];
    playerToAdd["name"] = player;
    team[playerToAdd.position].push(playerToAdd);
    delete playerDict[player];

    return player + " picked";
}

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
    return (
        <div>
            <div>
                <h2>Team1 Roster</h2>
                <ul>
                    <p><strong>Players:</strong> {testPrintPlayers(team1)}</p>
                </ul>
            </div>
            <div>
                <h2>Team2 Roster</h2>
                <ul>
                    <p><strong>Players:</strong> {testPrintPlayers(team2)}</p>
                </ul>
            </div>
        </div>
    );
};




let count = 0;
let playerDict = getRosterData();
let team1 = {"QB":[], "RB":[], "WR":[], "TE":[], "K":[], "D/ST":[]};
let team2 = {"QB":[], "RB":[], "WR":[], "TE":[], "K":[], "D/ST":[]};

const DraftPage = () => {
    const [inputText, setInputText] = useState('');
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState("QB");
    const [displayText, setDisplayText] = useState("Start Drafting! Team 1 pick");

    const handleInputChange = (e) => { // filter a list of 6 players based on selected position and names
        const text = e.target.value;
        setInputText(text);
        const match =  Object.keys(playerDict).some(player => player.toLowerCase() === text.toLowerCase());// hide the dropdown if whole name is typed in
        if (!match && text !== '') {
        const filtered = Object.keys(playerDict).filter(player => playerDict[player].position === selectedPosition && 
            player.toLowerCase().includes(text.toLowerCase())).slice(0, 6);
        setFilteredPlayers(filtered); 
    } else {
        setFilteredPlayers([]);
    }};
    const handlePositionChange = (e) => { // change positions
        setSelectedPosition(e.target.value);
        setFilteredPlayers([]);
    };

    // Create a function to handle the submit
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission
        if (count % 2 === 0){
            let ret = draftPlayer(playerDict, inputText, team1, selectedPosition);
            setDisplayText(ret); 
            if(ret !== "no player found" && ret !== "player does not play this position"){
                count += 1;
            }
            setDisplayText("Team 2 pick!");
        }
        else{
            let ret = draftPlayer(playerDict, inputText, team2, selectedPosition);
            setDisplayText(ret);
            if(ret !== "no player found" && ret !== "player does not play this position"){
                count += 1;
            }
            setDisplayText("Team 1 pick!");

        }
        if (count === 4) {
            setDisplayText("Drafting Done:");
        }
        setInputText(''); // Clear the input field after submitting
        setFilteredPlayers([]);
    };

    return (
<div className="Draft">
    <div className="Home">
            <form action="" method="get">
            <input
                        id="userquery"
                        name="query"
                        type="text"
                        placeholder="Player Name"
                        value={inputText}
                        onChange={handleInputChange} // filtering names here
                    />

                    
                    {filteredPlayers.length > 0 && (
                        <ul style={{ border: '0.5px solid', listStyle: 'Arial',  padding: 20}}>
                            {filteredPlayers.map((player, index) => (
                                <li key={index} style={{ padding: '1px', cursor: 'grab', fontWeight: 'bold'}}
                                    onClick={() => {
                                        setInputText(player); 
                                        setFilteredPlayers([]); 
                                    }}>
                                    {player}
                                </li>
                            ))}
                        </ul>
                    )}
                <select name="category" onChange={handlePositionChange}> {/* should this be static or dynamic */}
                    <option value="QB">QB</option>
                    <option value="WR">WR</option>
                    <option value="OLINE">O-LINE</option>
                    <option value="TE">TE</option>
                    <option value="RB">RB</option>\
                    <option value="SFT">SAFETY</option>
                    <option value="WR">D-LINE</option>
                    <option value="LB">LB</option>
                    <option value="CB">CB</option>
                    <option value="SPT">SPECIAL</option>
                </select>
                <input type="submit" onClick={handleSubmit}/>
            </form>
        </div>
    <div className="market_table">
            <table border="1">
                <tr>
                    <th>QB</th>
                    <th>WR</th>
                    <th>O-LINE</th>
                    <th>TE</th>
                    <th>RB</th>
                    <th>SAFETY</th>
                    <th>D-LINE</th>
                    <th>LB</th>
                    <th>CB</th>
                    <th>SPECIAL TEAM</th>
                </tr>
                <tr>
                </tr>
                <tr>
                </tr>
                <tr>
                </tr>
                <tr>
                </tr>
            </table>
    </div>
    <body>
        <p>{displayText}</p>
        <p>{count === 4 && <DisplayJson jsonData1={team1} jsonData2={team2}/>}</p>
        
    </body>
</div>
)
}
export default DraftPage;