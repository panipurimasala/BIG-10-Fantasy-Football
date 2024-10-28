import React, { useState } from "react";
import { Link } from "react-router-dom";
import './FreeAgencyPage.css';

function getAllPlayers() {
    let allPlayers = require("../mock_data/allPlayers.json");
    return allPlayers;
}

const FreeAgencyPage = () => {
    const [inputText, setInputText] = useState('');
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [allPlayers] = useState(getAllPlayers());

    const handleInputChange = (e) => {
        const text = e.target.value;
        setInputText(text);
        if (text !== '') {
            const filtered = Object.keys(allPlayers).filter(player =>
                player.toLowerCase().includes(text.toLowerCase())
            ).slice(0, 10);
            setFilteredPlayers(filtered);
        } else {
            setFilteredPlayers([]);
        }
    };

    return (
        <div className="FreeAgency">
            <div className="SearchBar">
                <input
                    type="text"
                    placeholder="Search for a player"
                    value={inputText}
                    onChange={handleInputChange}
                />
                {filteredPlayers.length > 0 && (
                    <ul className="PlayerList">
                        {filteredPlayers.map((player, index) => (
                            <li key={index} className="PlayerItem">
                                <Link to={`/free_agency/player/${player}`}>{player} - {allPlayers[player].position}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="AllPlayers">
                <h2>All Available Players</h2>
                <table className="PlayerTable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Team</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(allPlayers).map((player, index) => (
                            <tr key={index}>
                                <td><Link to={`/free_agency/player/${player}`}>{player}</Link></td>
                                <td>{allPlayers[player].position}</td>
                                <td>{allPlayers[player].team}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FreeAgencyPage;
