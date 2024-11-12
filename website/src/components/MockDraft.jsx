import React, { useState } from "react";
import { json } from "react-router-dom";
import './MockDraft.css';
import Confetti from 'react-confetti';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

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
    if (!playerDict[player]) {
        return "No player found";
    }
    if(Object.values(team).some(posArray => 
        posArray.some(pickedPlayer => pickedPlayer.name === player))) {
        return "Player has already been picked"
    }
    if (playerDict[player].position !== position) {
        return "player does not play this position"
    } 
    if(!Object.keys(playerDict).includes(player)){
        return "no player found";
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
let count = 0;
const userTeam = { "QB": [], "RB": [], "WR": [], "TE": [], "K": [] };
const playerDict = getRosterData();

const MockDraft = () => {
    const [inputText, setInputText] = useState('');
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState("QB");
    const [displayText, setDisplayText] = useState("Start Drafting!");
    const [showConfetti, setShowConfetti] = useState(false);
    const [pickedPlayers, setPickedPlayers] = useState([]);


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
        if (count < 4) {
            // Try to draft the player
            let ret = draftPlayer(playerDict, inputText, userTeam, selectedPosition);
            setDisplayText(ret);
            // Check if the player was successfully added
            if (ret === `${inputText} picked`) {
                const pickedPlayer = { name: inputText, position: selectedPosition };
                setPickedPlayers([...pickedPlayers, pickedPlayer]);
                count++;
            }
            
            // Check if we've reached the limit after adding the player
            if (count === 4) {
                setDisplayText("Drafting complete!");
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 30000);
            }
            setInputText('');
            setFilteredPlayers([]);
        }
    }
    ;

    return (
<div className="Draft">
    <div className="Home">
    {showConfetti && <Confetti />}
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
                        <ul className="filteredlist" style={{ border: '0.5px solid', listStyle: 'Arial',  padding: 20}}>
                            {filteredPlayers.map((player, index) => (
                                <li className="names" key={index} style={{ padding: '1px', cursor: 'grab', fontWeight: 'bold'}}
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
                    <option value="TE">TE</option>
                    <option value="RB">RB</option>\
                    <option value="D/ST">Defense/Special Teams</option>
                    
                </select>
                <input type="submit" value = "Draft Player" onClick={handleSubmit}/>
            </form>
        </div>
    <body>
        <p className="display-text">{displayText}</p>
        <div className="table-container">
            <table border="1">
                <thead>
                    <th colSpan="2">Your team</th>
                </thead>
                <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Position</th>
                        </tr>
                        <TransitionGroup component={null}>
                            {pickedPlayers.map((player, index) => (
                                <CSSTransition key={index} timeout={500} classNames="fade">
                                    <tr>
                                        <td>{player.name}</td>
                                        <td>{player.position}</td>
                                    </tr>
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                    </tbody>
            </table>
    </div>
        
        
    </body>
</div>
)
}
export default MockDraft;