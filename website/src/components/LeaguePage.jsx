import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './LeaguePage.css';

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
    const [createtourneyName, setCreateTourneyName] = useState ('');
    const [createPassword, setCreatePassword] = useState('');
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
    const handleCreatePrivateSubmit = (e) => {
        e.preventDefault();
        if (createtourneyName && createPassword) { // tourneyName means the ID in this function
            
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
    const Divider = () => {
        return (
          <div className="divider-container">
            <div className="divider-line" />
            <span className="divider-text">- or -</span>
            <div className="divider-line" />
          </div>
        );
    };


    if (isAuthenticated) {
        return (
        <div className='pageContainer'>
            <div className='leagueContainer'>
                <div className="headerLogin">
                    <h1>Join a League</h1>
                    <form onSubmit={handlejoinPrivateSubmit}>
                        <label>
                            <p className='passwordText'>League ID:</p>
                            <input
                                type="text"
                                value={tourneyName}
                                onChange={(e) => setTourneyName(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <label>
                            <p className='passwordText'>Password:</p>
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <button className='leagueButton' type="submit">Join League</button>
                    </form>
                </div>
                <Divider />
                <div className='createLeague'>
                <h1>Create a League</h1>
                    <form onSubmit={handleCreatePrivateSubmit}>
                        <label>
                            <p className='passwordText'>League ID:</p>
                            <input
                                type="text"
                                value={createtourneyName}
                                onChange={(e) => setCreateTourneyName(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <label>
                            <p className='passwordText'>Password:</p>
                            <input
                                type="text"
                                value={createPassword}
                                onChange={(e) => setCreatePassword(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <button className='leagueButton' type="submit">Join League</button>
                    </form>
                </div>
            </div>
            <div className='currentLeaguesContainer'>
                    <div className='currentHeader'><h1 className='currentLeaguesText'>Current Leagues</h1></div>
                    <div className='currentLeaguesDisplay'>
                        <h1>You are not in any Leagues</h1>
                        <br />
                        <h1>Join or Create One to Get Started!</h1>
                    </div>
            </div>
        </div>);
    }
    else {
        return (<h1 className="headerNoLogin">Login To Get Started</h1>);
    }


}
export default League;