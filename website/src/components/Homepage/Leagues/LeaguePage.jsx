import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import supabase from "../../../supabaseClient";
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
    const [leagues, setLeagues] = useState([]);
    const navigate = useNavigate();
    const [users, setUsers] = useState(null);
    const [error, setError] = useState('');
    const [usersData, setUsersData] = useState({});
    const [leaguess, setLeaguess] = useState([]);
    const [numUsers, setNumUsers] = useState(null);
    const teamPlayers = {
        "QB": [],
        "RB": [],
        "WR": [],
        "TE": [],
        "Flex": [],
        "D/ST": [],
        "K": [],
        "Bench": []
    };

    /*useEffect(() => {
        const getNumPlayers = async(leagueID) => {
            const { data: userLeagues, error: userError } = await supabase
                .from("user_leagues")
                .select("league_id", )
                .eq("user_id", userId);
            if (userError) {
                console.error("error in getting leagues");
                return;
            }
        }

    });*/



    // Get the current user and leagues on component mount
    useEffect(() => {
        const getUserAndLeagues = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            //console.log(user);
            setSession(user !== null);
            if (user) {
                await getLeagues(user.id);
            }
        };
        getUserAndLeagues();
    }, []);

    useEffect(() => {
        const getNumUsers = async () => {
            // Use map to create a new array with updated numUsers values, only if not already set
            const updatedLeagues = await Promise.all(leagues.map(async (league) => {
                if (league.numUsers === undefined) {  // Only fetch if numUsers is not set
                    const { data } = await supabase.from(league.league_name + "_user_teams").select('*');
                    const numUsers = data.length;
                    return { ...league, numUsers }; // Add numUsers if not already set
                }
            }));
            setLeagues(updatedLeagues);
        };
    
        if (leagues.length > 0 && leagues[0].numUsers === undefined) {
            getNumUsers();
        }
    }, [leagues]);  // Dependency array stays as leagues
    



    const getLeagues = async (userId) => {
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
            const tableName = `${tourneyName}_user_teams`;
            const { insertTeamError } = await supabase
                .from(tableName)
                .insert({
                    user_id: utilizer.id,
                    team_name: teamName,
                    team_players: teamPlayers
                });


            const { error: joinError } = await supabase
                .from("user_leagues")
                .insert({ user_id: userId, league_id: leagueId, team_name: teamName });

            if (joinError) {
                console.error("Error joining league:", joinError);
                alert("Error joining league. Please try again.");
            } else {
                alert("Successfully joined the league!");
                getLeagues(userId); // Refresh leagues list after joining
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

            // const { error: userError } = await supabase
            //     .from("user_leagues")
            //     .insert({ user_id: utilizer.id, league_id: newLeagueId });

            // if (userError) {
            //     alert("Unable to add you to the league.");
            //     return;
            // }
            const createTableSQL = `CREATE TABLE IF NOT EXISTS "${createtourneyName}_free_agency" (LIKE ${'players'} INCLUDING ALL);`;
            const { error: createError } = await supabase.rpc('execute_sql', { query_statement: createTableSQL });
            if (createError) {
                alert("Please retry creating a League.");
            }
            else {
                const insertDataSQL = `INSERT INTO "${createtourneyName}_free_agency" SELECT * FROM ${'players'};`;
                const { error: insertError } = await supabase.rpc('execute_sql', { query_statement: insertDataSQL });

                if (insertError) {
                    alert("Please retry creating a league.")
                }
                const createTableSQL = `CREATE TABLE IF NOT EXISTS "${createtourneyName}_user_teams" (LIKE ${'newleague_user_teams'} INCLUDING ALL);`;
                const { error: createError } = await supabase.rpc('execute_sql', { query_statement: createTableSQL });
                if (createError) {
                    alert("Please retry creating a League.");
                }
                const tableName = `${createtourneyName}_user_teams`;

                for (let i = 0; i < 1000000000; i++) {

                }
                // const { insertTeamError } = await supabase
                //     .from(tableName)
                //     .insert({
                //         user_id: utilizer.id,
                //         team_name: "fillin",
                //         team_players: teamPlayers
                //     });
                // if (insertTeamError) {
                //     console.error("Supabase Error:", error.message);
                //     console.error("Details:", error);
                // }



                // Success: Show success message and refresh leagues list
                alert("Successfully created and joined the league!");
                getLeagues(utilizer.id); // Refresh leagues list after creating
            }

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

    const navigateToLeagueHomePage = (leagueName) => {
        navigate(`/league_homepage/${leagueName}`);
    };

    
    const [leagueBlock, setLeagueBlock] = useState(null);

    // UseEffect to handle the leagues display logic
    useEffect(() => {
        if (leagues.length > 0) {
            setLeagueBlock(
                <div className="currentLeaguesDisplay">
                    {leagues.map((league, index) => (
                        <div
                            className="leagueBlocks"
                            key={index}
                            onClick={() => navigateToLeagueHomePage(league.league_name)}
                        >
                            <h1 className="leagueName">{league.league_name}</h1>
                            <h2 className="numPlayers">
                                {league.numUsers !== undefined
                                    ? `${league.numUsers}/10 players`
                                    : `Loading...`}
                            </h2>
                        </div>
                    ))}
                </div>
            );
        } else {
            setLeagueBlock(
                <div className="currentLeaguesDisplay noLeague">
                    <h1 className="noLeagueHeader">No Leagues Yet</h1>
                    <h1 className="noLeagueHeader2">Join or Create a League to Get Started!</h1>
                </div>
            );
        }
    }, [leagues]);

    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const { data: leagues, error } = await supabase.from("user_leagues").select("league_id").eq("user_id", utilizer.id);
                //console.log(leagues);
                if (error) throw error;
                setLeaguess(leagues); // Store leagues in state
            } catch (err) {
                setError('Error fetching leagues');
                console.error(err);
            }
        };

        fetchLeagues(); // Fetch leagues once on mount
    }, []);

    const fetchUsersForLeague = async (leagueId) => {
        try {
            const { data, error } = await supabase
                .from("user_leagues")
                .select("team_name")
                .eq("league_id", leagueId); // Assuming 'league_id' matches
            if (error) throw error;

            // Update the usersData state with the number of users for this league
            setUsersData(prevState => ({
                ...prevState,
                [leagueId]: data.length // Store the user count for each leagueId
            }));
        } catch (err) {
            setError('Error fetching users');
            console.error(err);
        }
    };

    useEffect(() => {
        if (leaguess.length > 0) {
            leaguess.forEach((league) => {
                fetchUsersForLeague(league.leagueid); // Fetch users for each league by its ID
            });
        }
    }, [leaguess]);


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
                    {leagueBlock}
                </div>
            </div>
        </div>
    ) : (
        <h1 className="headerNoLogin">Login To Get Started</h1>
    );
}

export default League;
