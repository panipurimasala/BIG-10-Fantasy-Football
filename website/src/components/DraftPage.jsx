import React, { useState } from "react";
import './DraftPage.css';
import supabase from '../supabaseClient';


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
/*const DisplayJson = ({jsonData1, jsonData2}) => {
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
        </div>
    );
};*/




let count = 0;
let team1 = {"QB":[], "RB":[], "WR":[], "TE":[], "K":[], "D/ST":[]};

const DraftPage = () => {
    const [inputText, setInputText] = useState('');
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState("QB");
    const [displayText, setDisplayText] = useState("Start Drafting! Team 1 pick");
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const { data: playersData, error } = await supabase
                    .from('players')
                    .select('*');

                if (error) throw error;

                const playerMap = {};
                playersData.forEach(player => {
                    playerMap[player.name] = player;
                });

                setPlayerDict(playerMap);
            } catch (err) {
                console.error("Error fetching players:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);

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
        if (count % 2 === 0 && count < 4){
            let ret = draftPlayer(playerDict, inputText, team1, selectedPosition);
            setDisplayText(ret); 
            if(ret !== "no player found" && ret !== "player does not play this position"){
                count += 1;
                setDisplayText("Team 2 pick!");
            }
            
        }
        else if (count < 4){
            let ret = draftPlayer(playerDict, inputText, team2, selectedPosition);
            setDisplayText(ret);
            if(ret !== "no player found" && ret !== "player does not play this position"){
                count += 1;
                setDisplayText("Team 1 pick!");
            }
            

        }
        if (count >= 4) {
            setDisplayText("Drafting Done");
            localStorage.setItem("team1", JSON.stringify(team1));
            localStorage.setItem("team2", JSON.stringify(team2));
            return;
        }
        setInputText(''); // Clear the input field after submitting
        setFilteredPlayers([]);
    };

    if (loading) {
        return <p>Loading players...</p>;
    }

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
    <body>
        <h1 className="draftText">{displayText}</h1>
        <div className="table-container">
            <table border="1">
                <thead>
                    <th colSpan="2">Team1</th>
                </thead>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                    </tr>
                    {team1["QB"].map((player, index) => (
                        <tr key={index}>
                            <td>{player.name}</td>
                            <td>{player.position}</td>
                        </tr>
                    ))}
                    {team1["WR"].map((player, index) => (
                        <tr key={index}>
                            <td>{player.name}</td>
                            <td>{player.position}</td>
                        </tr>
                    ))}
                    {team1["RB"].map((player, index) => (
                        <tr key={index}>
                            <td>{player.name}</td>
                            <td>{player.position}</td>
                        </tr>
                    ))}
                    {team1["TE"].map((player, index) => (
                        <tr key={index}>
                            <td>{player.name}</td>
                            <td>{player.position}</td>
                        </tr>
                    ))}
                    {team1["K"].map((player, index) => (
                        <tr key={index}>
                            <td>{player.name}</td>
                            <td>{player.position}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <table border="1">
                <thead>
                    <th colSpan="2">Team2</th>
                </thead>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                    </tr>
                    {team2["QB"].map((player, index) => (
                        <tr key={index}>
                            <td>{player.name}</td>
                            <td>{player.position}</td>
                        </tr>
                    ))}
                    {team2["WR"].map((player, index) => (
                        <tr key={index}>
                            <td>{player.name}</td>
                            <td>{player.position}</td>
                        </tr>
                    ))}
                    {team2["RB"].map((player, index) => (
                        <tr key={index}>
                            <td>{player.name}</td>
                            <td>{player.position}</td>
                        </tr>
                    ))}
                    {team2["TE"].map((player, index) => (
                        <tr key={index}>
                            <td>{player.name}</td>
                            <td>{player.position}</td>
                        </tr>
                    ))}
                    {team2["K"].map((player, index) => (
                        <tr key={index}>
                            <td>{player.name}</td>
                            <td>{player.position}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
    </div>
        
        
    </body>
</div>
)
}
export default DraftPage;