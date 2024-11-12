import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import supabase from "../supabaseClient";
import './LeaguePage.css';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function League() {
    const [tourneyName, setTourneyName] = useState('');
    const [password, setPassword] = useState('');
    const [teamName, setTeamName] = useState('');
    const [createtourneyName, setCreateTourneyName] = useState('');
    const [createPassword, setCreatePassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [session, setSession] = useState(null);
    const [utilizer, setUser] = useState(null);
    const [leaguess, setLeagues] = useState([]);
    const navigate = useNavigate();

    // Get the current user and leagues on component mount
    useEffect(() => {
        const getUserAndLeagues = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setSession(user !== null);
            if (user) {
                await leagues(user.id);
            }
        };
        getUserAndLeagues();
    }, []);

    const leagues = async (userId) => {
        try {
            const { data: userLeagues, error: userError } = await supabase
                .from("user_leagues")
                .select("league_id")
                .eq("user_id", userId);

            if (userError) {
                console.error("Error fetching user leagues:", userError);
                return;
            }

            if (userLeagues.length > 0) {
                const leagueIds = userLeagues.map(item => item.league_id);
                const { data: leagueNames, error: leagueError } = await supabase
                    .from("leagues")
                    .select("league_name")
                    .in("leagueid", leagueIds);

                if (leagueError) {
                    console.error("Error fetching league names:", leagueError);
                    setLeagues([]);
                } else {
                    setLeagues(leagueNames || []);
                }
            } else {
                setLeagues([]);
            }
        } catch (err) {
            console.error("Unexpected error fetching leagues:", err);
            setLeagues([]);
        }
    };

    const handleJoinPrivateSubmit = async (e) => {
        e.preventDefault();
        if (tourneyName && password) {
            const { data, error } = await supabase
                .from("leagues")
                .select("leagueid")
                .eq("league_name", tourneyName)
                .eq("password", password);

            if (error || !data.length) {
                alert("This league doesn't exist. Please check the league name and password.");
                return;
            }

            const leagueId = data[0].leagueid;
            const userId = utilizer.id;

            const { error: joinError } = await supabase
                .from("user_leagues")
                .insert({ user_id: userId, league_id: leagueId, team_name: teamName});

            if (joinError) {
                console.error("Error joining league:", joinError);
                alert("Error joining league. Please try again.");
            } else {
                alert("Successfully joined the league!");
                leagues(userId); // Refresh leagues list after joining
            }
            setTourneyName('');
            setPassword('');
            setTeamName('');
        }
    };

    const handleCreatePrivateSubmit = async (e) => {
        e.preventDefault();
        if (createPassword !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        const newLeagueId = uuidv4();
        const { error } = await supabase
            .from("leagues")
            .insert({ leagueid: newLeagueId, league_name: createtourneyName, password: createPassword });

        if (error) {
            alert("This league already exists or an error occurred. Please try again.");
            return;
        }

        if (utilizer) {

            const { error: userError } = await supabase
                .from("user_leagues")
                .insert({ user_id: utilizer.id, league_id: newLeagueId});

            if (userError) {
                alert("Unable to add you to the league.");
                return;
            }

            alert("Successfully created and joined the league!");
            leagues(utilizer.id); // Refresh leagues list after creating
        }

        setCreateTourneyName('');
        setCreatePassword('');
        setConfirmPassword('');
    };

    const Divider = () => (
        <div className="divider-container">
            <div className="divider-line" />
            <span className="divider-text">- or -</span>
            <div className="divider-line" />
        </div>
    );
    
    const navigateToDraftPage = (name) => {
        navigate(`/draft_page/${name}`);
    }

    const leagueBlock = () => {
        if(leaguess.length > 0) { return (
            <div className="currentLeaguesDisplay">
                {leaguess.map((league, index) => (
                        <div className="leagueBlocks" key={index} onClick={() => navigateToDraftPage(league.league_name)}> 
                            <h1 className="leagueName">{league.league_name}</h1>
                            <h2 className="numPlayers">1/10 players</h2>
                        </div>
                ))}
            </div>
        )} else {
            return(
                <div className="currentLeaguesDisplay noLeague">
                    <h1 className="noLeagueHeader">No Leagues Yet</h1>
                    <h1 className="noLeagueHeader2">Join or Create a League to Get Started!</h1>
                </div>)}
        
    };

    return session ? (
        <div className='pageContainer'>
            <div className='leagueContainer'>
                <div className="headerLogin">
                    <h1 className="leagueHeaders">Join a League</h1>
                    <form onSubmit={handleJoinPrivateSubmit}>
                        <label>
                            <p className='passwordText'>League ID:</p>
                            <input className='inputLeagueFields'
                                type="text"
                                value={tourneyName}
                                onChange={(e) => setTourneyName(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <label>
                            <p className='passwordText'>Password:</p>
                            <input className='inputLeagueFields'
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <label>
                            <p className='passwordText'>Team Name:</p>
                            <input className='inputLeagueFields'
                                type='text'
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <button className='joinLeagueButton' type="submit">Join League</button>
                    </form>
                </div>
                <Divider />
                <div className='createLeague'>
                    <h1 className="leagueHeaders">Create a League</h1>
                    <form onSubmit={handleCreatePrivateSubmit}>
                        <label>
                            <p className='passwordText'>League Name:</p>
                            <input className='inputCreateLeagueFields'
                                type="text"
                                value={createtourneyName}
                                onChange={(e) => setCreateTourneyName(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <label>
                            <p className='passwordText'>Password:</p>
                            <input className='inputCreateLeagueFields'
                                type="password"
                                value={createPassword}
                                onChange={(e) => setCreatePassword(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <label>
                            <p className='passwordText'>Confirm Password:</p>
                            <input className='inputCreateLeagueFields'
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <button className='createLeagueButton' type="submit">Create League</button>
                    </form>
                </div>
            </div>
            <div className='currentLeaguesContainer'>
                <div className='currentHeader'>
                    <h1 className='currentLeaguesText'>Current Leagues</h1>
                </div>
                <div className="currentLeaguesDisplay noLeague">
                    {leagueBlock()}
                </div>
            </div>
        </div>
    ) : (
        <h1 className="headerNoLogin">Login To Get Started</h1>
    );
}

export default League;
