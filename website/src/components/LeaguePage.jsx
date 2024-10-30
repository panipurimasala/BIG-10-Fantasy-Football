import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function getTournamentData() {
    let allTournaments = require("../mock_data/privateTournaments.json");
    let tournamentDict = {};
    Object.keys(allTournaments).forEach(tournament => {
            tournamentDict[tournament] = allTournaments[tournament];
    })
    return tournamentDict;
}

let tournamentDict = getTournamentData();

function League() {
    const [tourneyName, setTourneyName] = useState ('');
    const [password, setPassword] = useState('');
    const { isAuthenticated } = useAuth0();
    /* const handlePublicSubmit = (e) => { // for now only can join by used ID and password
        e.preventDefault();
        if (tourneyName) {
            const match =  Object.keys(publicTournamentsData).some(tourney => tourney.toLowerCase() === tourneyName.toLowerCase());
            if (match) {
                alert (' Joined tournament with ID: ${tourneyName)');
            }
            setTourneyName('');

        }
    }; */
    const handlejoinPrivateSubmit = (e) => {
        e.preventDefault();
        if (tourneyName && password) { // tourneyName means the ID in this function
            const match =  Object.keys(tournamentDict).some(tournament => tournamentDict[tournament].id === tourneyName
            && tournamentDict[tournament].password === password);
            if (match) {
                alert ('joined private tournament');
            } else {
                alert (' invalid ID or password');
            }
            setTourneyName('');
            setPassword('');
        }
    };
    /* const handlePrivateSubmit = (e) => {
        e.preventDefault();
        if (tourneyName && password) {
            alert ('Created tournament with ID: ${tourneyName}');
            // export the tourney ID and shi
        } else {
            alert (" Invalid input");
        }
    }; */

    if (isAuthenticated) {
        return (<div>
            <h1>Join a Private League</h1>
            <form onSubmit={handlejoinPrivateSubmit}>
                <label>
                    League ID:
                    <input
                        type="text"
                        value={tourneyName}
                        onChange={(e) => setTourneyName(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Join Private League</button>
            </form>
        </div>);
    }
    else {
        return (<h1>Login To Get Started</h1>);
    }


}
export default League;