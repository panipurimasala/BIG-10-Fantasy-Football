import React from 'react';
import { useParams } from 'react-router-dom';
import './PlayerSummaryPage.css';

function getAllPlayers() {
    let allPlayers = require("../mock_data/allPlayers.json");
    return allPlayers;
}

const PlayerSummaryPage = () => {
    const { playerName } = useParams();
    const allPlayers = getAllPlayers();
    const player = allPlayers[playerName];

    if (!player) {
        return <div>Player not found</div>;
    }

    return (
        <div className="PlayerSummary">
            <h1>{playerName}</h1>
            <div className="player-details">
                <p><strong>Position:</strong> {player.position}</p>
                <p><strong>Team:</strong> {player.team}</p>
                <p><strong>Eligibility:</strong> {player.eligibility}</p>
            </div>
        </div>
    );
};

export default PlayerSummaryPage;

