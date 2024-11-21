import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './MockDraft.css';
import supabase from "../supabaseClient";
import './LeagueDraft.css';
import MockDraft from "./MockDraft";
import LeagueDraftFunctionality from "./LeagueDraftFunctionality";
import { useNavigate } from 'react-router-dom';

const LeagueDraft = () => {
    const { leagueName } = useParams();
    console.log("League Name from URL:", leagueName);
    const [teamName, setTeamName] = useState(null); 
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(null);      
    const [users, setUsers] = useState(null);
    const [draftStarted, setDraftStarted] = useState(false); // New state to track if draft has started
    const [lengthofdraft, setLengthOfDraft] = useState(false);
    const [indOfPlayer, setIndOfPlayer] = useState(0);

    const [fbPlayerDict, setFbPlayerDict] = useState({});
    const [usersTeams, setUsersTeams] = useState({});
    const navigate = useNavigate();
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

                setFbPlayerDict(playerMap);
            } catch (err) {
                console.error("Error fetching players:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);
    
    const navigateToLeagueFreeAgency = (name) => {
        console.log("Navigating to league free agency with name:", name);
        navigate(`/free_agency_${name}`);
    }



    const getTeamName = async () => {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
            console.error('Error fetching user:', authError);
            return 'No user found';
        }
    
        const { data: userLeagues, error: userError } = await supabase
            .from("user_leagues")
            .select("team_name")
            .eq("user_id", user.id);
    
        if (userError) {
            console.error('Error fetching user leagues:', userError);
            return 'Error fetching team name';
        }
    
        if (!userLeagues || userLeagues.length === 0) {
            return 'No team assigned';
        }
    
        return userLeagues[0].team_name;
    };

    useEffect(() => {
        const fetchTeamName = async () => {
            try {
                const teamNameFetched = await getTeamName(); 
                setTeamName(teamNameFetched); 
            } catch (err) {
                setError('Error getting team name');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        const getUsers = async () => {
            try {
                const leagueId = await supabase.from("leagues").select("leagueid").eq("league_name", leagueName);
                const leagueIdValue = leagueId.data[0]["leagueid"];
                const userTeams = await supabase.from("user_leagues").select("team_name").eq("league_id", leagueIdValue);
                setUsers(userTeams.data);
                console.log(users);
            } catch (err) {
                setError('Error fetching team name');
                console.error(err);
            }
        };
        
        getUsers();
        fetchTeamName();
    }, [leagueName]); 
    
    const startDraft = () => {
        setDraftStarted(true);
        let tempUsersTeams = {}
        users.forEach(user => {
            tempUsersTeams[user] = {"QB":[], "RB":[], "WR":[], "TE":[], "K":[], "D/ST":[]};
        });
        setUsersTeams(tempUsersTeams);
    
        // Make a copy of the users array to shuffle
        const shuffledUsers = [...users];
        
        // Fisher-Yates shuffle
        for (let i = shuffledUsers.length - 1; i > 0; i--) {
            const randInd = Math.floor(Math.random() * (i + 1));
            [shuffledUsers[i], shuffledUsers[randInd]] = [shuffledUsers[randInd], shuffledUsers[i]];
        }
    
        // Set the shuffled array back to users state to re-render with the draft order
        setUsers(shuffledUsers);
        setLengthOfDraft(shuffledUsers.length);
    };

    
    
    const setCountInPage = (val) => {
        if(indOfPlayer === users.length-1){
            users.reverse();
        }
        setIndOfPlayer(val%users.length);
    }
    return (
        <div>
            <div className="leagueDraftTitleContainer">
                <h1 className="leagueDraftTitle">{leagueName} Draft Page</h1>
                <p className="team-title">Your team: {teamName}</p>
            </div>
            <div className="draftContainer">
                <div className="draftFunction"><LeagueDraftFunctionality name = {leagueName} onChangesInCount = {setCountInPage}/></div>
                <div className="draftOrder">
                    <h2>Draft Order</h2>
                    {draftStarted ? "Draft ongoing" : <button onClick={startDraft}>Start Draft</button>} {/* Button to start the draft */}
                    {draftStarted && (
                        <div>
                            <h3>your team: {teamName}</h3> {/* Show the current team name at the top */}
                            {users && users.length > 0 ? (
                                <ul>
                                    {users.map((user, index) => (
                                        <li key={index} className="teamItem">
                                            {user.team_name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No teams found in this league.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="userList">
                <h2>Teams in League</h2>
                {users && users.length > 0 ? (
                    <ul>
                        {users.map((user, index) => (
                            <li key={index} className="teamItem">
                                {user.team_name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No teams found in this league.</p>
                )}
            </div>
            <div><button onClick={() =>navigateToLeagueFreeAgency(leagueName)}>Free Agency Page</button></div>
        </div>
    );
}

export default LeagueDraft;
